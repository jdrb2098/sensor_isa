import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const SensorData = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [latestRecord, setLatestRecord] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://miprimeraapp-production.up.railway.app/api/sensors/temperatures/');
        const data = response.data.slice(0, 20); // Solo los últimos 20 registros
        setData(data);
        setLatestRecord(data[0]); // Actualizar el último registro
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error al obtener los datos');
      }
    };

    fetchData();

    // Actualizar el último registro cada 30 segundos
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval); // Limpiar intervalo al desmontar el componente
  }, []);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-3xl w-full mb-8">
        <h1 className="text-2xl font-bold px-6 py-4 bg-gray-800 text-white">Últimos 20 registros</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Temperatura</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Marca de tiempo</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-300">
              {data.map(item => (
                <tr key={item.timestamp} className="hover:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap">{item.temperature} °C</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(item.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-3xl w-full">
        <h1 className="text-2xl font-bold px-6 py-4 bg-gray-800 text-white">Gráfico de Temperaturas</h1>
        <BarChart width={800} height={400} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="temperature" fill="#8884d8" />
        </BarChart>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-3xl w-full mt-8">
        <h1 className="text-2xl font-bold px-6 py-4 bg-gray-800 text-white">Último registro</h1>
        {latestRecord && (
          <div className="px-6 py-4">
            <p className="font-bold">Temperatura: {latestRecord.temperature} °C</p>
            <p className="font-bold">Marca de tiempo: {new Date(latestRecord.timestamp).toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SensorData;
