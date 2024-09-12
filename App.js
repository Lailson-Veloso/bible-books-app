import React, { useState, useEffect } from 'react';
import { Text, View, Button, FlatList, TextInput } from 'react-native';
import * as SQLite from 'expo-sqlite';


export default function App() {
  const database = SQLite.openDatabaseSync('bible.db');

  const [books, setBooks] = useState([]);
  const [name, setName] = useState('');

  const createTable = async () => {
    try {
        await database.execAsync(`
            CREATE TABLE IF NOT EXISTS books(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL
            )
        `)

        console.log(database)
    }
        
    catch (error) {
        console.error(error)
    }
  }

  const addBook = async () => {
    try {
        if (name == "") {
            return alert("Campo nome obrigatório!")
        }

        await database.runAsync("INSERT INTO books (name) VALUES (?)", name)
    }
    
    catch (error) {
        console.error(error)
    }
  }

  const readBooks = async () => {
    try {
      setBooks(await database.getAllAsync("SELECT * FROM books"))
    }
    
    catch (error) {
        console.error(error)
    }
  }

  const dropTable = async () => {
    try {
        await database.execAsync('DROP TABLE IF EXISTS books')
    }
    
    catch (error) {
        console.error(error)
    }
  }

  useEffect(() => {
    //createTable()
  }, [createTable])

  useEffect(() => {
    readBooks()
  }, [readBooks])

  useEffect(() => {
    //dropTable()
  }, [dropTable])

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Bíblia - Livros</Text>
      
      <TextInput
        placeholder="Nome do Livro"
        onChangeText={setName}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />

      <Button
        title='Adicionar Livro'
        onPress={() => addBook()}
      />

      <View>
        <FlatList
          data={books}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ marginVertical: 10 }}>
              <Text>{item.name}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}
