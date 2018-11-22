// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: false,
    // Initialize Firebase
    firebaseConfig: {
      apiKey: "AIzaSyCcdyFMy1N6u4YaQK7h1UNKR-JuYhTmMjY",
      authDomain: "feedlyapp-1a300.firebaseapp.com",
      databaseURL: "https://feedlyapp-1a300.firebaseio.com",
      projectId: "feedlyapp-1a300",
      storageBucket: "feedlyapp-1a300.appspot.com",
      messagingSenderId: "620631438712"
    }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
