import { FC, useState } from "react";
import emailjs from 'emailjs-com';

export const Footer: FC = () => {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage('Please enter a valid email.');
      return;
    }

    emailjs
      .send(
        'service_qhhhy6g', // Replace with your EmailJS Service ID
        'template_mpr8116', // Replace with your EmailJS Template ID
        {
          message: email,
        },
        'A4ybXJWi9VVjLhE5L' // Replace with your EmailJS Public Key
      )
      .then(
        () => {
          setMessage('Prenumerationen lyckades! Tack för att du prenumererar.');
          setEmail('');
        },
        (error) => {
          console.error('Failed to send email:', error);
          setMessage('Failed to send subscription. Please try again later.');
        }
      );
  };

  return (
  <div className="fixed w-full bottom-0 z-10 bg-white flex flex-row h-[80px] border-t border-neutral-300 py-2 px-8 items-center sm:justify-between justify-center">
    <div className="mx-auto p-4 bg-white shadow-lg rounded-lg">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Ange din e-postadress..."
          className="flex-grow border w-[200px] sm:w-[250px] border-gray-300 rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-[#008d7f]"
        />
        <button type="submit" className="bg-[#008d7f] text-white font-bold py-2 px-4 rounded-md hover:bg-[#95ebe2]">
          Prenumerera
        </button>
      </form>
      
      {message && <p className="text-[#008d7f] text-center mt-2">{message}</p>}
    </div>
  </div>);
};
