
import React from 'react';
import { StyleSheet, Text, View,FlatList, TouchableOpacity,TextInput} from 'react-native';
import firebase from 'firebase'
import db from "../config";

export default class SearchScreen extends React.Component {
  constructor(){
  super();
  this.state={
    allTransactions:[],
    lastVisibleTransaction:null,
    search:[]
  }
  }
  componentDidMount=async()=>{
    const query=await db.collection("transaction").get()
    query.docs.map((doc)=>{
      this.setState({
        allTransactions:[...this.state.allTransactions,doc.data()]
      })
    })
  }
  fetchMoreTransactions=async()=>{
    var text=this.state.search.toUpperCase();
    var enteredText=text.split("");
    if(enteredText[0].toUpperCase()==="B"){
      const query=await db
      .collection("transaction")
      .where("bookId","==",text)
      .startAfter(this.state.lastVisibleTransaction)
      .limit(10)
      .get()
      query.docs.map((doc)=>{
        this.setState({
          allTransactions:[...this.state.allTransactions,doc.data()],
          lastVisibleTransaction:doc
        })
      })
    }
  else if(enteredText[0].toUpperCase()==="S"){
    const query=await db
    .collection("transaction")
    .where("bookId","==",text)
    .startAfter(this.state.lastVisibleTransaction)
    .limit(10)
    .get()
    query.docs.map((doc)=>{
      this.setState({
        allTransactions:[...this.state.allTransactions,doc.data()],
        lastVisibleTransaction:doc
      })
    })  
  }  
  }
  searchTransactions=async(text)=>{
    var enteredText=text.split("");
    if(enteredText[0].toUpperCase()==="B"){
      const query=await db
      .collection("transaction")
      .where("bookId","==",text)
      .get()
      query.docs.map((doc)=>{
        this.setState({
          allTransactions:[...this.state.allTransactions,doc.data()],
          lastVisibleTransaction:doc
        })
      })
    }
  else if(enteredText[0].toUpperCase()==="S"){
    const query=await db
    .collection("transaction")
    .where("bookId","==",text)
    .get()
    query.docs.map((doc)=>{
      this.setState({
        allTransactions:[...this.state.allTransactions,doc.data()],
        lastVisibleTransaction:doc
      })
    })  
  }  
  }
  render(){
  return (
    <View>
      <View  style={{flexDirection:"row",justifyContent:"center",alignItems:"center",flex: 1,}}>
      <TextInput  
        style={styles.searchBar} 
        placeholder="StudentId or BookId"
        onChangeText={(text)=>{
          this.setState({
            search:text
          })
         }}
        />
      
      <TouchableOpacity style={styles.searchButton} onPress={()=>{
        this.searchTransactions(this.state.search);
      }}>
     <Text style={{color:"white"}}>
       Search
       </Text>  
 </TouchableOpacity>
 </View>  
    <FlatList
    data={this.state.allTransactions}

    renderItem={({item})=>{
      <View>
        <Text>
          {"Book Id :" +item.bookId }
        </Text>
        <Text>
          {"Student Id :" +item.studentId }
        </Text>
        <Text>
          {"Date :" +item.data }
        </Text>
        <Text>
          {"TransactionType :" +item.transactionType }
        </Text>
      </View>
    }}
    keyExtractor={(item,index)=>{
      index.toString();
    }}
    onEndReached={this.fetchMoreTransactions}
    onEndReachedThreshold={0.7}
    />
    </View>
  );
}

        }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding:10
  },
  searchButton:{
    borderWidth:2,
    height:40,
    width:60,
    backgroundColor:"green",
    justifyContent:'center',
    alignItems:"center",
    padding:10
  },
  searchBar:{
    borderWidth:2,
    height:40,
    width:350,
    flexDirection:'row',
    padding:10,

  }
});
