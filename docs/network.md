---
title: Network Management
layout: default
nav_order: 6
---

# Network Management

## Data Handling + React Query

While the Context API and Redux Toolkit are powerful tools for managing local and global application state, managing server-state (data fetched from APIs) presents unique challenges. This is where React Query comes into play. By integrating Axios with React Query, you can efficiently manage server-state alongside your existing state management strategy, whether you're using the Context API or Redux Toolkit. This approach allows you to keep your state management logic clean and focused while leveraging React Query for more complex data fetching needs.

## Axios

Axios is utilized as the HTTP client for making network requests in React Native. The Fetch API provided by the browser is powerful but lacks features like interceptors, request cancellation, and automatic JSON parsing. Axios, with its intuitive API, support for Promise-based requests, and features such as interceptors and automatic JSON parsing, offers a robust solution for handling data fetching and communication with backend services.

[Learn more about Axios](https://axios-http.com/docs/intro)

## Integrating Axios with React Query

React Query is a powerful data-fetching and state management library that works seamlessly with Axios to manage server-state in React applications. By using React Query, you can simplify the management of caching, synchronization, and background updates for your data. This integration allows you to focus on building your UI while React Query handles the complexity of managing server state, retrying failed requests, and optimizing data fetching.

React Query combined with Axios allows for more efficient and manageable network requests by automatically caching data, managing query states, and providing tools for background refetching and optimistic updates.

```javascript
import axios from "axios";
import { useQuery } from "react-query";

const fetchData = async () => {
  const response = await axios.get("/api/data");
  return response.data;
};

const ExampleComponent = () => {
  const { data, error, isLoading } = useQuery("dataKey", fetchData);

  if (isLoading) return "Loading...";
  if (error) return "An error occurred";

  return <div>{data}</div>;
};
```

[Learn more about React Query](https://tanstack.com/query/v3)
