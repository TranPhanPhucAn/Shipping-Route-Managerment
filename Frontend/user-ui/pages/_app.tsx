import "@/styles/globals.css";
import "antd/dist/reset.css";
import { ApolloProvider, InMemoryCache, ApolloClient } from "@apollo/client";
import { Provider } from "react-redux";
import { store } from "../store";
import type { AppProps } from "next/app";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </ApolloProvider>
  );
}
export default App;
