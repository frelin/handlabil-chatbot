import { Chat } from "@/components/Chat/Chat";
import { Footer } from "@/components/Layout/Footer";
import { Navbar } from "@/components/Layout/Navbar";
import { Message } from "@/types";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import Image from 'next/image';
import carImage from '../public/car5.png';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [carData, setCarData] = useState<any[]>([]);
  const [finished, setFinished] = useState<boolean>(false);

  useEffect(() => {
    const fetchCarData = async () => {
      const res = await fetch(`/api/carData`);
      const data = await res.json();
      setCarData(data);
    };

    fetchCarData();
  }, []);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (message: Message) => {
    const updatedMessages = [...messages, message];

    setMessages(updatedMessages);
    setLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: updatedMessages
      })
    });

    if (!response.ok) {
      setLoading(false);
      throw new Error(response.statusText);
    }
    
    const data = response.body;

    if (!data) {
      return;
    }

    setLoading(false);

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let isFirst = true;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      let chunkValue = decoder.decode(value);

      if(chunkValue.includes("[DONE]")){
        setFinished(true);
        chunkValue = chunkValue.replace('[DONE]', '');
      }

      if (isFirst) {
        isFirst = false;
        setMessages((messages) => [
          ...messages,
          {
            role: "assistant",
            content: chunkValue
          }
        ]);
      } else {
        setMessages((messages) => {
          const lastMessage = messages[messages.length - 1];
          const updatedMessage = {
            ...lastMessage,
            content: lastMessage.content + chunkValue
          };
          return [...messages.slice(0, -1), updatedMessage];
        });
      }
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: "assistant",
        content: `Välkommen till Handla Bil. Behöver du hjälp?`
      }
    ]);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `Välkommen till Handla Bil. Behöver du hjälp?`
      }
    ]);
  }, []);

  return (
    <>
      <Head>
        <title>Handla Bil ChatBot</title>
        <meta
          name="description"
          content="Handla Bil ChatBot"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>

      <div className="flex flex-col">
        <Navbar />

        <div className="flex-1 overflow-auto sm:px-10 pb-4 sm:pb-10 mt-[3.75rem] relative bg-[#fdfdfd]">
          <div className="w-full md:max-w-8xl container mx-auto mt-4 sm:mt-12 relative">
            <Chat
              messages={messages}
              loading={loading}
              carData={carData}
              finished={finished}
              onSend={handleSend}
              onReset={handleReset}
            />
            <div ref={messagesEndRef} />
          </div>

          {/* <div className="fixed bottom-20 right-0 mb-4 mr-4">
            <Image src={carImage} alt="Car" width={500} />
          </div> */}
        </div>
        <Footer />
      </div>
    </>
  );
}
