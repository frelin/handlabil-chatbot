import { Message } from "@/types";
import { FC, useState, useEffect } from "react";
import Robot from '../../public/robot.jpg';
import Image from "next/image";
import PriceCalculatorModal from './PriceCalculatorModal';
import LoadingModal from './LoadingModal';
import emailjs from 'emailjs-com';

const imageUrlPattern = /https?:\/\/[^\s]+/g;

interface Props {
  message: Message;
  carData: any[];
  finished: boolean;
}

export const ChatMessage: FC<Props> = ({ message, carData, finished }) => {
  const [currentIndex, setCurrentIndex] = useState<number[]>([]);
  const [keyword, setKeyword] = useState(false);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean[]>([]);
  const [filteredMessage, setFilteredMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    if(carData.length > 0){
      setLoading(false);
    }else{
      setLoading(true);
    }
  },[carData])
  const sendEmailData = (email: string) => {
    var saved_car = localStorage.getItem("savedCar");
    if(email){emailjs
      .send(
        'service_qhhhy6g',
        'template_mpr8116',
        {
          message: `car - ${saved_car} ${email != '' ? email:''}`,
        },
        'A4ybXJWi9VVjLhE5L'
      )
      .then(
        () => {
          console.log('sent email');
        },
        (error) => {
          console.error('Failed to send email:', error);
        }
      );}
  };
  const loaded = () => {
    setLoading(false);
  }

  const sendPhoneData = (phone: string) => {
    var saved_car = localStorage.getItem("savedCar");
    if(phone){emailjs
      .send(
        'service_qhhhy6g',
        'template_mpr8116',
        {
          message: `car - ${saved_car} ${phone != '' ? phone:''}`,
        },
        'A4ybXJWi9VVjLhE5L'
      )
      .then(
        () => {
          console.log('sent email');
        },
        (error) => {
          console.error('Failed to send email:', error);
        }
      );}
  };
  

  const openModal = (index: number) => {
    setIsModalOpen(prevState => {
      const newState = [...prevState];
      newState[index] = true;
      return newState;
    });
  };

  const closeModal = (index: number) => {
    setIsModalOpen(prevState => {
      const newState = [...prevState];
      newState[index] = false;
      return newState;
    });
  };


  useEffect(() => {
    if (!message.content) return;

    if (message.content.includes('Filter')) {
      setKeyword(true);
      const filter = message.content.split('Filter: ')[1]?.split('.')[0];
      console.log("=======message========", filter);
      if (filter) {
        setFilteredMessage(message.content.replace(` Filter: ${filter}.`, ''));

        const filterParts = filter.split(' ');

        const make = filterParts.find((item) => item.includes('make'));
        const model = filterParts.find((item) => item.includes('model'));
        const gear = filterParts.find((item) => item.includes('gear'));
        const range = filterParts.find((item) => item.includes('price_range'));
        const fourwheel = filterParts.find((item) => item.includes('fourwheel'));
        const milage_range = filterParts.find((item) => item.includes('milage_range'));
        const fuel_range = filterParts.find((item) => item.includes('fuel_range'));
        const seat = filterParts.find((item) => item.includes('seat'));

        localStorage.setItem(
          "savedCar", `${make?.replace('make-', '')} 
          ${model? model.replace('model-', ''):''} 
          ${gear? gear.replace('gear-', ''): ''} 
          ${range? 'pris: ' + range: ''} 
          ${fourwheel? fourwheel : ''} 
          ${milage_range? milage_range: ''} 
          ${fuel_range? fuel_range: ''}
          ${seat? seat.replace('seat-', ''): ''} `)

        let updatedFilteredData = carData;

        if (make) {
          updatedFilteredData = updatedFilteredData?.filter((item) =>
            item.name.toLowerCase().includes(make.replace('make-', '').toLowerCase())
          );
        }

        if (model) {
          updatedFilteredData = updatedFilteredData?.filter((item) =>
            item.name.replace(/\s+/g, '-').toLowerCase().includes(model.replace('model-', '').toLowerCase())
          );
        }

        if (gear) {
          updatedFilteredData = updatedFilteredData?.filter((item) =>
            item.gearBox.toLowerCase().includes(gear.replace('gear-', '').toLowerCase())
          );
        }

        if (fourwheel && fourwheel.replace('fourwheel-', '').toLowerCase() === 'true') {
          updatedFilteredData = updatedFilteredData?.filter((item) =>
            item.additionalVehicleData?.fourWheelDrive === true
          );
        }

        if (seat) {
          updatedFilteredData = updatedFilteredData?.filter((item) =>
            item.additionalVehicleData.noPassangers >= Number(seat.replace('seat-', ''))
          );
        }

        if (range) {
          const [minPrice, maxPrice] = range.split('-').slice(1).map(Number);
          updatedFilteredData = updatedFilteredData?.filter(
            (item) =>
              Number(item.price.value) >= minPrice &&
              Number(item.price.value) <= maxPrice
          );
        }

        if (milage_range) {
          const [minMile, maxMile] = milage_range.split('-').slice(1).map(Number);
          updatedFilteredData = updatedFilteredData?.filter(
            (item) =>
              Number(item.milage) >= minMile &&
              Number(item.milage) <= maxMile
          );
        }

        
        if (fuel_range) {
          const [minFuel, maxFuel] = fuel_range.split('-').slice(1).map(Number);
          updatedFilteredData = updatedFilteredData?.filter(
            (item) =>
              Number(item.fuels.consumption) >= minFuel &&
              Number(item.fuels.consumption) <= maxFuel
          );
        }

        setFilteredData(updatedFilteredData);
      }
    }

    if(message.content.includes('EmailID') && finished) {
      const filter = message.content.split('EmailID: ')[1];
      setFilteredMessage(message.content.replace(` EmailID: ${filter}`, ''));
      sendEmailData(filter);
      
    }

    if(message.content.includes('PhoneNumber') && finished) {
      const filter = message.content.split('PhoneNumber: ')[1];
      setFilteredMessage(message.content.replace(` PhoneNumber: ${filter}`, ''));
      sendPhoneData(filter);
    }
  }, [message.content]);

  useEffect(() => {
    const newIndices = Array(filteredData.length).fill(0);
    setCurrentIndex(newIndices);
    setIsModalOpen(Array(filteredData.length).fill(false));
  }, [filteredData]);


  const nextImage = (imageUrls: any[], index: number) => {
    setCurrentIndex(prevIndex => {
      let newIndex = [...prevIndex];
      newIndex[index] = (newIndex[index] + 1) % imageUrls.length;
      return newIndex;
    });
  };

  const prevImage = (imageUrls: any[], index: number) => {
    setCurrentIndex(prevIndex => {
      let newIndex = [...prevIndex];
      newIndex[index] = (newIndex[index] - 1 + imageUrls.length) % imageUrls.length;
      return newIndex;
    });
  };

  // Render image slider and message content
  const renderMessageContent = () => {
    if (filteredData.length > 0) {
      return (
        <div className='flex flex-row gap-2 flex-wrap'>
          {filteredData.slice(0,100).map((item, index) => (
            <div
            key={index}>
            <PriceCalculatorModal isOpen={isModalOpen[index]} onClose={() => closeModal(index)} data={item} />
            <div className="flex items-center w-[20rem] bg-neutral-200 text-neutral-900 rounded-2xl px-3 py-2 whitespace-pre-wrap relative"
                 style={{ overflowWrap: "anywhere" }}>
              <div className="my-2 w-full">
                {/* Image slider */}
                <div className="relative w-full max-w-[100%] h-[200px] overflow-hidden">
                  <a
                    className="flex justify-center"
                    href={item.images[currentIndex[index]]?.imageFormats[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    { 
                      item.images[currentIndex[index]]?.imageFormats[0].url &&
                      <Image
                        src={item.images[currentIndex[index]]?.imageFormats[0].url}
                        alt={`Image ${currentIndex[index]}`}
                        width="300"
                        height="200"
                        style={{ borderRadius: '8px' }}
                        priority
                      />
                    }
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
                  <div className="mt-4 p-4 bg-white shadow-md rounded-lg min-h-[22rem]">
                    <h2 className="text-3xl font-bold text-gray-800">{item.make} {item.model}</h2>
                    <p className="text-lg text-gray-600">{item.name}</p>
                    
                    <div className="flex flex-col md:flex-row flex-wrap items-start md:items-center text-gray-500 mt-2">
                      <span className="mr-3 flex items-center">
                        <span className="mr-1 min-w-[1.37rem]">🚗</span>{item.modelYear}
                      </span>
                      <span className="mr-3 flex items-center">
                        <span className="mr-1 min-w-[1.37rem]">📏</span>{item.milage}
                      </span>
                      <span className="flex items-center">
                        <span className="mr-1 min-w-[1.37rem]">⛽</span>{item.fuel}
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
                  <div className="flex flex-row items-center justify-between mt-4 py-4 px-10 bg-white shadow-md rounded-lg">
                    <a
                        className="flex justify-center hover:cursor-pointer"
                        onClick={()=>openModal(index)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >Kalkylator</a>
                    <a
                      className="flex justify-center"
                      href={"https://www.handlabil.se/handlabil/" + 
                        item.modelYear + "-" +
                      item.name.replace(/\s+/g, '-').replace(".", '-').toLowerCase() + "-" +
                      item.regNo.toLowerCase() + "-" +
                      item.id}
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

  return (
  <div>
    <LoadingModal isOpen={loading} onClose={() => loaded()} />
    <div className={`flex flex-col ${message.role === "assistant" ? "items-start" : "items-end"}`}>
      {message.role === "assistant" ? (
        <div className="flex flex-row items-start">
          <div className="mr-1">
            <div className="bg-neutral-200 rounded-full w-8 h-8 flex items-center justify-center">
              <Image src={Robot} alt="Robot" className="w-8 h-8 rounded-full" />
            </div>
          </div>
          <div className="flex flex-col mr-2">
              {filteredData.length > 0 ?(
                <div className="flex flex-col gap-4">
                  {message.content?.split('Keyword')[0] != "" && (
                    <div className="flex items-center bg-neutral-200 text-neutral-900 rounded-2xl px-3 py-2 max-w-[67%] whitespace-pre-wrap" style={{ overflowWrap: "anywhere" }}>
                      {filteredMessage != "" ? filteredMessage?.split('Keyword')[0] : message.content?.split('Keyword')[0]}
                    </div>
                  )}
                  {renderMessageContent()}
                </div>
              ):(
                <div className="flex items-center bg-neutral-200 text-neutral-900 rounded-2xl px-3 py-2 max-w-[67%] whitespace-pre-wrap" style={{ overflowWrap: "anywhere" }}>
                  {keyword ? (
                    <div>
                      vi har för närvarande ingen bil du vill ha men om du anger din e-postadress kan vi kontakta din e-post när vi har en ny bil.
                    </div>

                  ):(
                    <div>{message.content}</div>
                  )}
                </div>
              )}
          </div>
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