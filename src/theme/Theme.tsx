import React, { ReactNode, useState } from "react";
import { createContext, useContext } from "react";

export const basicPropertiesNames = {
  primary: "primary",
  onPrimary: "onPrimary",
  secondary: "secondary",
  onSecondary: "onSecondary",
  surface: "surface",
  onSurface: "onSurface",
  background: "background",
  onBackground: "onBackground",
  error: "error",
  onError: "onError",
  info: "info",
  onInfo: "onInfo",
  succes: "succes",
  onSucces: "onSucces",
};

/**
 * Object with name assigned to every used color (string form).
 */
export type Theme = {
  [name: string]: string;
};

/**
 * Object with name assigned to every used theme.
 */
export type ThemesSet<CustomTheme> = {
  [name: string]: CustomTheme & Theme;
};

/**
 * Context with `getProperty` function that returns `string` or `undefined`
 */
type ExternalThemingContextType = {
  getProperty: (name: string) => string | undefined;
};

/**
 * External Theming Context that can be used without knowing the structure of the theming.
 * Enables usage of the theming by external components without importing the `useTheming` function
 * generated only isinde the final app project.
 */
const ExternalThemingContext = createContext<ExternalThemingContextType>({
  getProperty: (_) => undefined,
});

/**
 * Hook that enables usage of Theming Context without need to import the `useTheming` function
 * generated only isinde the final app project. Enables usage of the theming inside
 * exteranl components if  property names are known
 * @returns `ExternalThemingContext`
 */
export const useThemingExternal = () => useContext(ExternalThemingContext);

type InternalThemesResolverType<CustomThemeSet, CustomTheme> = Record<
  keyof CustomThemeSet | "default",
  | Record<
      keyof CustomTheme,
      {
        set: (value: string) => boolean;
        toString: () => string;
      }
    > & { use: () => void }
>;
/**
 *  Creates theme resolver
 * @param initialThemes - set of themes when creating the context
 * @param valuesResolver - function that returnes value of theming propert for given name and theme
 * @param valueSetter - function that sets value of theming propert for given name and theme
 * @param themeSetter - function that changes the current theme
 * @returns `ThemingResolver`
 */
export const makeResolverObject = <CustomThemeSet, CustomTheme>(
  initialThemes: CustomThemeSet & ThemesSet<CustomTheme>,
  valuesResolver: (
    propertyName: keyof CustomTheme,
    themeName: keyof CustomThemeSet | undefined
  ) => string,
  valueSetter: (
    newValue: string,
    propertyName: keyof CustomTheme,
    themeName: keyof CustomThemeSet | undefined
  ) => void,
  themeSetter: (themeName: keyof CustomThemeSet) => void
): InternalThemesResolverType<CustomThemeSet, CustomTheme> => {
  let resolver = {};
  // Iterating over every theme
  for (const [themeName, theme] of Object.entries(initialThemes)) {
    // For each theme create function tha when called sets it as used theme
    resolver[themeName] = {
      use: () => themeSetter(themeName as keyof CustomThemeSet),
    };
    // For each property inside theme generate the resolver
    for (const propertyName of Object.keys(theme)) {
      const getValue = () => {
        return valuesResolver(
          propertyName as keyof CustomTheme,
          (themeName == "default"
            ? undefined
            : themeName) as keyof CustomThemeSet
        );
      };

      resolver[themeName][propertyName] = {
        set: (value: string) => {
          valueSetter(
            value,
            propertyName as keyof CustomTheme,
            (themeName == "default"
              ? undefined
              : themeName) as keyof CustomThemeSet
          );
        },
        toString: getValue,
      };
    }
  }
  return resolver as InternalThemesResolverType<CustomThemeSet, CustomTheme>;
};

export const createProvider =
  <ProvidedProps extends unknown>(
    Provider: React.Provider<ProvidedProps>,
    value: ProvidedProps
  ) =>
  (props: { children: ReactNode }) => {
    return <Provider value={value}>{props.children}</Provider>;
  };

/**
 *  Creates new theming context for the app
 * @param initialThemes - set of themes when creating the context
 * @param defaultTheme - name of the theme that shuld be used by default
 * @returns Object with properties:
 *  - `ThemingProvider` - Provider of the theming context
 *  - `useTheming` - hook for resolving theming inside the app
 */
export const includeCustomTheming = <CustomThemeSet, CustomTheme>(
  initialThemes: CustomThemeSet & ThemesSet<CustomTheme>,
  defaultTheme?: keyof CustomThemeSet
) => {
  const InternalContext = createContext(
    makeResolverObject(
      initialThemes,
      () => undefined,
      () => null,
      () => null
    )
  );

  const ProvidersComponent = (props: { children: ReactNode }) => {
    const [themes, setThemes] = useState<
      CustomThemeSet & ThemesSet<CustomTheme>
    >(initialThemes);
    const [currentTheme, setCurrentTheme] = useState<keyof CustomThemeSet>(
      defaultTheme || (Object.keys(themes)[0] as keyof CustomThemeSet)
    );

    const valueSetter = (
      newValue: string,
      propertyName: keyof CustomTheme,
      themeName: keyof CustomThemeSet | undefined
    ) => {
      const newThemes = { ...themes };
      newThemes[themeName || currentTheme][propertyName] = newValue as any;
      setThemes({ ...newThemes, ...themes });
    };

    const valueGetter = (
      propertyName: keyof CustomTheme,
      themeName: keyof CustomThemeSet | undefined
    ) => {
      return themes[themeName || currentTheme][propertyName];
    };

    const themeSetter = (themeName: keyof CustomThemeSet) => {
      setCurrentTheme(themeName);
    };

    const themeResolver = makeResolverObject<CustomThemeSet, CustomTheme>(
      initialThemes,
      valueGetter,
      valueSetter,
      themeSetter
    );

    const InternalProvider = createProvider(
      InternalContext.Provider,
      themeResolver
    );

    const ExternalProvider = createProvider(ExternalThemingContext.Provider, {
      getProperty: (name: string) => {
        try {
          return themes[currentTheme][name] || undefined;
        } catch (e) {
          // When no current theme is set or property doesn't exist
          return undefined;
        }
      },
    });
    return (
      <InternalProvider>
        <ExternalProvider>{props.children}</ExternalProvider>
      </InternalProvider>
    );
  };

  return {
    ThemingProvider: ProvidersComponent,
    useTheming: () =>
      useContext<InternalThemesResolverType<CustomThemeSet, CustomTheme>>(
        InternalContext
      ),
  };
};
