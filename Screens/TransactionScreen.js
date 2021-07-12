
import React from 'react';
import { StyleSheet, Text, View ,TouchableOpacity, Touchable,TextInput, KeyboardAvoidingView} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';
import { Ionicons } from '@expo/vector-icons';
import firebase from 'firebase';
import db from "../config";
export default class TransactionScreen extends React.Component {
  constructor(){
    super();
    this.state={
      hasCameraPermissions:null,
      scanned:false,
     // scannedData:"",
      buttonState:"normal",
      scannedStudentID:"",
      scannedBookID:""

    }
  }
  handleTransaction=async()=>{
 // var TransactionMessage=null;
  db.collection("books").doc(this.state.scannedBookID).get().then((doc)=>{
  var  bookData=doc.data();
  alert(doc.data());
  if (bookData.bookAvailability) {
   this.intiateBookIssue();
   alert("bookIssued"); 
  }
  else{
    this.intiateBookReturn();
    alert("bookReturn");
  }
  })   
  }
  intiateBookIssue=async()=>{
   db.collection("transaction").add({
     'studentId':this.state.scannedStudentID,
     'bookId':this.state.scannedBookID,
     'data':firebase.firestore.Timestamp.now().toDate(),
     'transctionType':'issue',

   }) 
   db.collection("books").doc(this.state.scannedBookID).update({
    'bookAvailability':false, 
   })
   db.collection("students").doc(this.state.scannedStudentID).update({
     'numberOfBooksIssued':firebase.firestore.FieldValue.increment(1),
   })
   this.setState({
     scannedStudentID:"",
     scannedBookID:"",
   })
  }
  intiateBookReturn=async()=>{
    db.collection("transaction").add({
      'studentId':this.state.scannedStudentID,
      'bookId':this.state.scannedBookID,
      'data':firebase.firestore.Timestamp.now().toDate(),
      'transctionType':'return',
    }) 
    db.collection("books").doc(this.state.scannedBookID).update({
     'bookAvailability':true, 
    })
    db.collection("students").doc(this.state.scannedStudentID).update({
      'numberOfBooksIssued':firebase.firestore.FieldValue.increment(-1),
    })
    this.setState({
      scannedStudentID:"",
      scannedBookID:"",
    })
  }

  getCameraPermissions=async(id)=>{
    const {status}=await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermissions:status==="granted",
      buttonState:"clicked",
      scanned:false,
      buttonState:id,
      
    })
  }
  handleBarcodeScanned=async({type,data})=>{
    const {buttonState}=this.state;
    if (buttonState==="bookID") {
      this.setState({
        buttonState:"normal",
        scanned:true,
        scannedBookID:data,
        
    
  
      })

    }
    else if (buttonState==="studentID") {
      this.setState({
        buttonState:"normal",
        scanned:true,
        scannedStudentID:data,
    
      })
 
    }
    
  }
  render(){
    const hasCameraPermissions=this.state.hasCameraPermissions;
    const scanned=this.state.scanned;
    const buttonState=this.state.buttonState;
    if (buttonState!=="normal" && hasCameraPermissions) {
    return(
      
      <BarCodeScanner
      onBarCodeScanned={scanned?undefined:this.handleBarcodeScanned}
      style={StyleSheet.absoluteFillObject}
      />
    );    
      }
      else if (buttonState==="normal") {
        return (
          <KeyboardAvoidingView style={styles.container}
          behavior="height"  enabled
          >
          <View>
          <Ionicons name="book" size={250} color="green" />
          </View>
          <View  style={styles.rowWrapper}>
          <TextInput   placeholder="Student ID"   
          value={this.state.scannedStudentID}
          style={styles.inputBox}
          onChangeText={(text)=>{
           this.setState({
           scannedStudentID :text
           }) 
          }}
          
          />
          <TouchableOpacity style={styles.scannedButton} 
          
          onPress={()=>{
            this.getCameraPermissions("studentID")
          }}
          >
            <Text style={styles.textColor}>
              Scan
            </Text>
          </TouchableOpacity>
          </View>
          <View  style={styles.rowWrapper}>
          <TextInput   placeholder="Book ID"   
          
          style={styles.inputBox}
          onChangeText={(text)=>{
            this.setState({
            scannedBookID :text
            }) 
           }}
           value={this.state.scannedBookID}
          />
          <TouchableOpacity style={styles.scannedButton} 
          
          onPress={()=>{
            this.getCameraPermissions("bookID")
          }}
          >
            <Text style={styles.textColor}>
              Scan
            </Text>
          </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity  style={styles.submitButton}  onPress={async()=>{
              var transactionMessage = await this.handleTransaction();
            }}>
              <Text style={styles.buttonText}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
          </KeyboardAvoidingView>
        );   
      }
  
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
buttonBg:{
  backgroundColor:"black",
  padding:10,
  margin:20,
  height:40,
  fontSize:20,
  width:250,
  borderRadius:12,
  textAlign :'center',
}  ,
textColor:{
  color:"white"
},
rowWrapper:{
  flexDirection:'row',
  margin:20,

},
inputBox:{
width:200,
height:40,
borderWidth:2,
borderColor:"black",
marginRight:5,
fontSize:20,
borderRadius:6,
paddingLeft:10,

},
scannedButton:{
  backgroundColor:"green",
  width:60,
  height:40,
  fontSize:20,
  alignItems:"center",
  justifyContent:"center",
  borderRadius:6,
},
buttonText:{
  color:"white"
},
submitButton:{
  backgroundColor:"blue",
  padding:10,
  height:40,
  width:60,
  fontSize:20,
  margin:20,

}

});











