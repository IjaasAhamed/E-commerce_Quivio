import React, { useState, useEffect } from 'react';

export const DeliveryDateGenerator: React.FC = () => {
  const [deliveryDate, setDeliveryDate] = useState<string>('');

  useEffect(() => {
    const generateRandomDeliveryDate = () => {
      const today = new Date();
      const randomDays = Math.floor(Math.random() * 5) + 1; // 1 to 5 days
      const delivery = new Date(today);
      delivery.setDate(today.getDate() + randomDays);

      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short', // Short weekday (Mon, Tue, etc.)
        month: 'short',   // Short month (Mar, Apr, etc.)
        day: 'numeric',   // Day of the month
      };

      const formattedDate = delivery.toLocaleDateString(undefined, options);
      setDeliveryDate(formattedDate);
    };

    generateRandomDeliveryDate(); // Generate date on component mount
  }, []);

  return (
    <div>
      <p className='text-black'>Delivery by {deliveryDate}</p>
    </div>
  );
};