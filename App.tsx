import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, FlatList } from 'react-native';
import { Button, Provider as PaperProvider } from "react-native-paper";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

//Definindo PROPs para o valor input e seu Use State

interface Valor_input {
	button_ok: boolean;
	onChangeButton: Dispatch<SetStateAction<boolean>>;
}

export function Pokemon({ pokemon }) {
	return (
		<View style={styles.item}>
			<Text> {pokemon.name}</Text>
		</View>
	);
}

//------------- Segmento da tela com o ScrollView  ---------------------//
function Tela_Scrow({ button_ok, onChangeButton }: Valor_input) {

	const [viewVisible, setViewVisible] = useState(false);
	const handleVisible = () => setViewVisible(!viewVisible);
	const [currentPage, setCurrentPage] = useState(
		"https://pokeapi.co/api/v2/pokemon?limit=151&offset=000/"
	);

	const { isLoading, error, data } = useQuery("repoData", () =>
		fetch(currentPage).then((res) => res.json())
	);

	onChangeButton(false);

	if (isLoading) {
		return (
			<View style={styles.container}>
				<Text>Carregando...</Text>
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.container}>
				<Text>Erro ao carregar os dados...</Text>
			</View>
		);
	}


	return (
		<View style={styles.container_list}>
			<View style={styles.header}>
				<Text style={styles.texto}>*</Text>
				<Text style={styles.texto}>POKEMON</Text>
				<Text style={styles.texto}>*</Text>
			</View>
			<FlatList
				data={data.results}
				renderItem={({ item }) => <Pokemon pokemon={item} />}
				keyExtractor={(item) => item.name}
				extraData={currentPage}
			/>
		</View>
	);
}


// Create a client
const queryClient = new QueryClient();

// --------------------------------------------------------------------//
//                            Executar APP
// --------------------------------------------------------------------//

export default function App() {
	const [button_ok, onChangeButton] = useState<boolean>(false)

	return (
		<QueryClientProvider client={queryClient}>
			<View style={styles.container}>
				<Tela_Scrow button_ok={button_ok} onChangeButton={onChangeButton} />
				<StatusBar style="auto" />
			</View>
		</QueryClientProvider>
	);
}

// --------------------------------------------------------------------//
//                            STYLES
// --------------------------------------------------------------------//

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignContent: 'center',
		backgroundColor: '#f5f9eb',
		padding: 30,
	},
	container_botao: {
		backgroundColor: '#ffffff',
		alignItems: 'center',
		padding: 10,
		flex: 0.2,
		borderWidth: 1,
		borderColor: '#20232a',
	},
	item: {
		flexDirection: 'row',
		justifyContent: 'center',
		flexWrap: 'wrap',
		padding: 10,
		margin: 2,
		borderColor: '#2a4944',
		borderWidth: 1,
		backgroundColor: '#d2f7f1'
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 10,
		margin: 2,
		borderColor: '#2a4944',
		borderWidth: 1,
		backgroundColor: '#32cdc3',
	},
	container_list: {
		flex: 1,
		flexDirection: 'column',
		padding: 0,
	}
});
