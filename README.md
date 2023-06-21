# Testing Project 

### Setup

- Install dependencies
  - `3rd-party-tool-integrations-ts": "git+ssh://git@stash.americas.nwea.pvt/qa/3rd-party-tool-integrations-ts.git#main`
- Create a file `/key.json` and place TargetProcess token within.
- Import the project and token file.


### Example

/package.json
```
{
  "devDependencies": {
    "3rd-party-tool-integrations-ts": "git+ssh://git@stash.americas.nwea.pvt/qa/3rd-party-tool-integrations-ts.git#1.0.0",
  }
}

```

/key.json
```
{
  "token": "PAST-TOKEN-HERE"
}
```

/example.ts
```
import {TargetProcess} from "3rd-party-tool-integrations-ts";
import key from './key.json';

const tp = new TargetProcess(key.token);

it('Get User', () => {
  tp.getUser().then((user) => {
    console.log(user);
  });
});

```


## Notes

### Target Process API
- [Partial response (includes and excludes)](https://dev.targetprocess.com/docs/partial-response-includes-and-excludes) 🚧
  Depth of hierarchical nesting is limited.
  It is not possible to retrieve all nested entities from other list of nested entities within single API call using top-to-bottom approach. For example, it is not possible to retrieve Epics with all inner Features and all inner User Stories. Try to use bottom-to-top method when possible and compose data from multiple API calls on your side further.
