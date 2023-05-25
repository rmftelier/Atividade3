import React, { useEffect, useState } from "react";
import api from "./services/api";
import { Button, Box, Flex, Input, Select, Text, Heading, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { format } from 'date-fns';

function App() {
  //exchangeRates = taxas de câmbio
  const [exchangeRates, setExchangeRates] = useState(null);
  const [valor, setValor] = useState(1);
  const [moedaSelecionada, setMoedaSelecionada] = useState("BRL");
  const [converterClicado, setConverterClicado] = useState(false);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState(null);
  const [proximaAtualizacao, setProximaAtualizacao] = useState(null);

  useEffect(() => {
    api
      .get()
      .then((response) => {
        setExchangeRates(response.data);

        const dataUltimaAtualizacao = response.data.time_last_update_utc;
        const dataFormatadaU = format(new Date(dataUltimaAtualizacao), 'dd/MM/yyyy HH:mm');
        setUltimaAtualizacao(dataFormatadaU);

        const dataProximaAtualizacao = response.data.time_next_update_utc;
        const dataFormatadaP = format(new Date(dataProximaAtualizacao), 'dd/MM/yyyy HH:mm');
        setProximaAtualizacao(dataFormatadaP);
      })
      .catch((err) => {
        console.error("Oops! Ocorreu um erro: " + err);
      });
  }, [exchangeRates]); //para sempre que mudar a api mude as informações

  const handleMudancaValor = (e) => {
    setValor(e.target.value);
  };

  const handleMudancaMoeda = (e) => {
    setMoedaSelecionada(e.target.value);
    setConverterClicado(false);
  };

  const handleConverter = () => {
    setConverterClicado(true);
  };

  const simbolo = ['R$', '€', '¥'];

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Box p="6">
        <Heading textAlign="center" marginBottom="4">Taxa de Câmbio do Dólar Americano (USD)</Heading>
        
        <Text>Data da última atualização: {ultimaAtualizacao}</Text>
        <Text>Data da próxima atualização: {proximaAtualizacao}</Text>
        
        <Flex alignItems="center" marginTop="4">
          <Text mr="4.0rem">Valor: </Text>
          <InputGroup>
              <InputLeftElement 
                    children='$' 
                    pointerEvents='none'
                    color='gray.500'
                    fontSize='1.2em'
              />
              <Input     
                    placeholder="Entre com o valor" 
                    type="number" value={valor} 
                    onChange={handleMudancaValor} 
              />
          </InputGroup>
        </Flex>
        <Flex alignItems="center" marginTop="2">
          <Text mr="2">Converter para:</Text>
          <Select value={moedaSelecionada} onChange={handleMudancaMoeda} ml="2">
            <option value="BRL">Real (BRL)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="JPY">Iene (JPY)</option>
          </Select>
        </Flex>
        <Flex justifyContent="center" marginTop="4">
          <Button colorScheme='teal' onClick={handleConverter}>Converter</Button>
        </Flex>
        {converterClicado && exchangeRates && (
          <Box display="flex" justifyContent="center" marginTop="4">
              <Box>
                  <Text fontSize="3xl">
                      Valor Convertido: {simbolo[moedaSelecionada === 'BRL' ? 0 : moedaSelecionada === 'EUR' ? 1 : 2]}  
                      {(exchangeRates.conversion_rates[moedaSelecionada] * valor).toFixed(2)}
                  </Text>
              </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default App;