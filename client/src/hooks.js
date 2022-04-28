import { useQuery, useMutation, useSubscription } from "@apollo/react-hooks";
import {
  addMessageMutation,
  messagesQuery,
  messageAddedSubscription,
} from "./graphql/queries";

export const useChatMessages = () => {
  const { data } = useQuery(messagesQuery);
  const messages = data ? data.messages : [];
  useSubscription(messageAddedSubscription, {
    onSubscriptionData: ({ client, subscriptionData }) => {
      client.writeData({
        data: {
          messages: messages.concat(subscriptionData.data.messageAdded),
        },
      });
    },
  });
  const [addMessage] = useMutation(addMessageMutation);
  return {
    messages,
    addMessage: (text) => addMessage({ variables: { input: { text } } }),
  };
};
