import { QueryClient, QueryClientProvider, useQuery } from "react-query";

const queryClient = new QueryClient();

const Context = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default Context;
