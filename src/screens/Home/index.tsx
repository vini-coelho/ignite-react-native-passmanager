import React, { 
  useState, 
  useCallback, 
  useEffect,
  useContext
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { SearchBar } from '../../components/SearchBar';
import { LoginDataItem } from '../../components/LoginDataItem';

import {
  Container,
  LoginList,
  EmptyListContainer,
  EmptyListMessage
} from './styles';
import StorageContext from '../../context/StorageContext';

export interface LoginDataProps {
  id: string;
  title: string;
  email: string;
  password: string;
};

type LoginListDataProps = LoginDataProps[];

export function Home() {
  const [searchListData, setSearchListData] = useState<LoginListDataProps>([]);
  const { storedData } = useContext(StorageContext);

  async function loadData() {
    if(!storedData) return
    console.log(storedData)
    setSearchListData(storedData);
  }

  useEffect(() => {
    loadData();
  }, [storedData]);

  useFocusEffect(useCallback(() => {
    loadData();
  }, [storedData]));

  function handleFilterLoginData(search: string) {
    const filteredData = storedData.filter(item => item.title.includes(search));
    setSearchListData(filteredData);
  }

  return (
    <Container>
      <SearchBar
        placeholder="Pesquise pelo nome do serviço"
        onChangeText={(value) => handleFilterLoginData(value)}
      />

      <LoginList
        keyExtractor={(item) => item.id}
        data={searchListData}
        ListEmptyComponent={(
          <EmptyListContainer>
            <EmptyListMessage>Nenhum item a ser mostrado</EmptyListMessage>
          </EmptyListContainer>
        )}
        renderItem={({ item: loginData }) => {
          return <LoginDataItem
            title={loginData.title}
            email={loginData.email}
            password={loginData.password}
          />
        }}
      />
    </Container>
  )
}