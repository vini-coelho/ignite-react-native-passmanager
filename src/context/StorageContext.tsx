import React, {
  createContext,
  ReactNode,
  useState,
  useEffect
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginDataProps } from '../screens/Home';

const dataKey = '@passmanager:logins';

interface StoredData {
  storedData: LoginDataProps[];
  setStoredData: (newValue: LoginDataProps) => Promise<void>;
}

const StorageContext = createContext({} as StoredData);

interface Props {
  children: ReactNode;
}

export function StorageProvider({ children }: Props) {
  const [data, setData] = useState<LoginDataProps[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const storedData = await AsyncStorage.getItem(dataKey);
        console.log(storedData)
        if (storedData) setData(JSON.parse(storedData));
      } catch(err) {
        console.log(err);
      }
    }
    loadData();
  }, []);

  async function setStoredData(newData: LoginDataProps) {
    try {
      const response = await AsyncStorage.getItem(dataKey);
      if (!response) return;

      const currentData = JSON.parse(response)
      const formattedData = JSON.stringify([ ...currentData, newData ]);

      await AsyncStorage.setItem(dataKey, formattedData);
      setData(oldData => [ ...oldData, newData ]);
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <StorageContext.Provider value={{ storedData: data, setStoredData }}>
      {children}
    </StorageContext.Provider>
  );
}

export default StorageContext;