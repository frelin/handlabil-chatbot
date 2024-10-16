import { Message } from "@/types";
import { FC, useState, useEffect } from "react";
import Robot from '../../public/robot.jpg';
import Image from "next/image";
import carData from '../../public/handlabil.json';
import PriceCalculatorModal from './PriceCalculatorModal';

let i = 0
// Regex to detect image URLs
const imageUrlPattern = /https?:\/\/[^\s]+/g;

interface Props {
  message: Message;
}

export const ChatMessage: FC<Props> = ({ message }) => {
  const [currentIndex, setCurrentIndex] = useState<number[]>([0, 0, 0]);
  const [keyword, setKeyword] = useState(false);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<any[]>([false,false,false]);

  const openModal = (index: number) => {
    const updatedModals = [...isModalOpen];
    updatedModals[index] = true; // Open the specific modal
    setIsModalOpen(updatedModals);
  };

  const closeModal = (index: number) => {
    const updatedModals = [...isModalOpen];
    updatedModals[index] = false; // Close the specific modal
    setIsModalOpen(updatedModals);
  };


  useEffect(() => {
    if (message.content.includes('Keyword')) {
      setKeyword(true);
      var word = message.content.split("Keyword: ")[1]?.replaceAll(')', '');
      setFilteredData(carData.filter((item) => item.name.includes(word)));
      console.log(`========${i}===start=============`, word);
    }
    i++;
  }, [message.content]);

  // Function to go to the next image
  const nextImage = (imageUrls: [], index: number) => {
    setCurrentIndex(prevIndex => {
      let newIndex = [...prevIndex]
      newIndex[index] = (newIndex[index] + 1) % imageUrls.length

      return [...newIndex]
    })
  }

  // Function to go to the previous image
  const prevImage = (imageUrls: [], index: number) => {
    setCurrentIndex(prevIndex => {
      let newIndex = [...prevIndex]
      newIndex[index] = (newIndex[index] - 1 + imageUrls.length) % imageUrls.length

      return [...newIndex]
    })
  };

  // Render image slider and message content
  const renderMessageContent = (content: string) => {
    if (filteredData.length > 0) {
      return (
        <div className='flex flex-col gap-y-2 xl:gap-y-0 xl:flex-row'>
          {filteredData.slice(0, 3).map((item, index) => (
            <div
            key={index}>
              <PriceCalculatorModal isOpen={isModalOpen[index]} onClose={()=>closeModal(index)} data={item} />
              <div
                className="flex items-center bg-neutral-200 text-neutral-900 rounded-2xl px-3 py-2 whitespace-pre-wrap mx-2 relative"
                style={{ overflowWrap: "anywhere" }}>
                <div className="my-2 w-full">
                  {/* Image slider */}
                  <div className="relative w-full max-w-[100%] h-[200px] overflow-hidden">
                    {/* Clickable image */}
                    <a
                      className="flex justify-center"
                      href={item.images[currentIndex[index]]?.imageFormats[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src={item.images[currentIndex[index]]?.imageFormats[0].url}
                        alt={`Image ${currentIndex[index]}`}
                        width="300"
                        height="200"
                        style={{ borderRadius: '8px' }}
                        priority
                      />
                    </a>

                    {/* Navigation buttons */}
                    <button
                      onClick={() => prevImage(item.images, index)}
                      className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white text-black px-2 py-1 rounded"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => nextImage(item.images, index)}
                      className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white text-black px-2 py-1 rounded"
                    >
                      ›
                    </button>
                  </div>

                  {/* Text content below the slider */}
                  <div className="mt-4 p-4 bg-white shadow-md rounded-lg">
                    <h2 className="text-3xl font-bold text-gray-800">{item.make} {item.model}</h2>
                    <p className="text-lg text-gray-600">{item.name}</p>
                    
                    <div className="flex flex-col md:flex-row items-start md:items-center text-gray-500 mt-2">
                      <span className="mr-3 flex items-center">
                        <span className="mr-1">🚗</span>{item.modelYear}
                      </span>
                      <span className="mr-3 flex items-center">
                        <span className="mr-1">📏</span>{item.milage}
                      </span>
                      <span className="flex items-center">
                        <span className="mr-1">⛽</span>{item.fuel}
                      </span>
                    </div>

                    <div className="text-gray-500 mt-2">
                      <span className="flex">
                        <span className="mr-1 flex flex-col items-start">🏢</span>
                        {item.dealer.address.streetAddress}, {item.dealer.address.city}, {item.dealer.address.region}, {item.dealer.address.zipcode}
                      </span>
                    </div>

                    <h1 className="text-2xl font-bold text-[#008d7f] mt-4">
                      {item.price.value} kr
                    </h1>
                  </div>
                  <div className="flex flex-row items-center justify-between gap-8 mt-4 py-4 px-10 bg-white shadow-md rounded-lg">
                    <a
                        className="flex justify-center hover:cursor-pointer"
                        onClick={()=>openModal(index)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >Kalkylator</a>
                    <a
                      className="flex justify-center"
                      href={item.images[currentIndex[index]]?.imageFormats[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >Gå till Annonser</a>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>)
    }
  };

  return (<div>

    <div className={`flex flex-col ${message.role === "assistant" ? "items-start" : "items-end"}`}>

    {message.role === "assistant" ? (
      <div className="flex flex-row items-start">
        <div className="mr-2">
          <div className="bg-neutral-200 rounded-full w-12 h-12 flex items-center justify-center">
            <Image src={Robot} alt="Robot" className="w-12 h-12 rounded-full" />
          </div>
        </div>
        {!keyword ? (<div className="flex items-center bg-neutral-200 text-neutral-900 rounded-2xl px-3 py-2 max-w-[67%] whitespace-pre-wrap" style={{ overflowWrap: "anywhere" }}>
          {message.content}
        </div>) : (
          <div className="flex flex-col gap-4">
            {filteredData.length > 0 ?(<div className="flex items-center bg-neutral-200 text-neutral-900 rounded-2xl px-3 py-2 max-w-[67%] whitespace-pre-wrap" style={{ overflowWrap: "anywhere" }}>
              {message.content.split('Keyword')[0]}
            </div>):(<div className="flex items-center bg-neutral-200 text-neutral-900 rounded-2xl px-3 py-2 max-w-[67%] whitespace-pre-wrap" style={{ overflowWrap: "anywhere" }}>
              vi har inte det för närvarande men om du anger din e-postadress i nedanstående prenumerationsformulär kan du få ett meddelande när vi har en ny bil.
            </div>)}
            {renderMessageContent(message.content)}
          </div>
        )}
      </div>
    ) : (
      <div className="flex items-center bg-[#008d7f] text-white rounded-2xl px-3 py-2 max-w-[67%] whitespace-pre-wrap" style={{ overflowWrap: "anywhere" }}>
        {message.content}
      </div>
    )}
    </div>
  </div>
  );
};