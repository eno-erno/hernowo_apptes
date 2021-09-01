import React, {useState, useEffect} from "react"; 
import {View, Text, TouchableOpacity, Modal, StyleSheet, TextInput, Alert, Image, ScrollView, PermissionsAndroid} from "react-native"; 
import {launchCamera, launchImageLibrary} from "react-native-image-picker";

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalDetail, setModalDetail] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [photo, setphoto] = useState("");
  const [id, setId] = useState("");
  const [userList, setUserList] = useState([]);

  const newPost = async(e) => {
      if(!loading){
        if(firstName == '' || lastName == "" || age == "") return Alert.alert('gagal', 'field tidak boleh kosong');
        setLoading(true);
        const newData = {
            firstName,
            lastName,
            age,
            photo
        }
        fetch("https://simple-contact-crud.herokuapp.com/contact/" + id, {
            method: id ? "PUT" : "POST",
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(newData)
        }).then(res => res.json())
        .then(response => {
          console.log(response);
            if(response.statusCode == 400 || response.statusCode == 404) {
              setLoading(false);
              return Alert.alert('gagal', response.message);
            }
            setLoading(false);
            Alert.alert('berhasil', response.message);
            refresh();
            setModalVisible(false);
            setModalDetail(false);
            setFirstName('');
            setLastName('');
            setAge(''); 
            setphoto('');
            setId('');
            // M.toast({html: "Success new contact", classes: "#43a047 green darken-1"});
        }).catch(err=> console.log(err));
      }
  }
  const deleteContact = (params) => {
    fetch(`https://simple-contact-crud.herokuapp.com/contact/${params}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(response => {
        console.log(response);
        if(response.message === "contact unavailable"){
          return Alert.alert('gagal', response.message);
        }
        Alert.alert('berhasil', response.message);
        refresh();
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    fetch("https://simple-contact-crud.herokuapp.com/contact", {
        method: "GET",
        headers: {
            'Content-Type' : 'application/json'
        }
    }).then(res => res.json())
    .then(response => {
        setUserList(response.data);
    });
  }, [])
  const refresh = () => {
    fetch("https://simple-contact-crud.herokuapp.com/contact", {
        method: "GET",
        headers: {
            'Content-Type' : 'application/json'
        }
    }).then(res => res.json())
    .then(response => {
        setUserList(response.data);
    });
  }
  const test = "data:image/png;base64,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"
  const cameraDenied = async(type) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Cool Photo App Camera Permission",
          message:
            "Cool Photo App needs access to your camera " +
            "so you can take awesome pictures.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
        if(type === 'openCamara') return openCamara();
        if(type === 'openGallery') return openGallery();
      } else {
        console.log("");
        Alert.alert('warning', 'Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }
  const openCamara = () => {
    const options = {
      storageOptions: {
        path: 'images',
        mediaType: 'photo',
      },
      includeBase64: true,
    };
    
    launchCamera(options, response => {
    if (response.didCancel) {
    console.log('User cancelled image picker');
    } else if (response.error) {
    console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
    console.log('User tapped custom button: ', response.customButton);
    } else {
    // You can also display the image using data:
    const source = {uri: 'data:image/jpeg;base64,' + response.assets[0].base64};
    setphoto(source.uri);
    // console.log(source)
    }
    });
    };
    
  const openGallery = () => {
  const options = {
  storageOptions: {
  path: 'images',
  mediaType: 'photo',
  },
  includeBase64: true,
  };
  
  launchImageLibrary(options, response => {
  // console.log('Response = ', response);
  if (response.didCancel) {
  console.log('User cancelled image picker');
  } else if (response.error) {
  console.log('ImagePicker Error: ', response.error);
  } else if (response.customButton) {
  console.log('User tapped custom button: ', response.customButton);
  } else {
  // You can also display the image using data:
  const source = {uri: 'data:image/jpeg;base64,' + response.assets[0].base64};
  setphoto(source.uri);
  }
  });
  };
  return(
    <View style={{flex: 1}}>
    <ScrollView>
      <Text style={{fontWeight : "bold", fontSize: 20}}>Hernowo_Apptest</Text>
      <TouchableOpacity
          style={[styles.button, styles.buttonOpen]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.textStyle}>New Contact</Text>
      </TouchableOpacity>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
            setFirstName('');
            setLastName('');
            setAge(''); 
            setphoto('');
            setId('');
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Hello World!</Text>
              <TextInput value={firstName} placeholder="firstName" onChangeText={(e) => setFirstName(e)} />
              <TextInput value={lastName} placeholder="lastName" onChangeText={(e) => setLastName(e)} />
              <TextInput value={age} placeholder="age" onChangeText={(e) => setAge(e)} />
              <TouchableOpacity
                style={[styles.button, styles.buttonOpen]}
                onPress={() => cameraDenied('openCamara') }
              >
                <Text style={styles.textStyle}>Ambil Foto</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonOpen]}
                onPress={() => cameraDenied('openGallery') }
              >
                <Text style={styles.textStyle}>Ambil galery</Text>
              </TouchableOpacity>
              <Image source={{uri : photo ? photo : null}} style={{width: 100, height: 100}} />
              <TouchableOpacity
                style={[styles.button, styles.buttonOpen]}
                onPress={() => newPost()}
              >
                <Text style={styles.textStyle}>Create</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setModalVisible(!modalVisible)
                  setFirstName('');
                  setLastName('');
                  setAge(''); 
                  setphoto('');
                  setId('');
                }}
              >
                <Text style={styles.textStyle}>Hide Modal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalDetail}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalDetail(!modalDetail);
            setFirstName('');
            setLastName('');
            setAge(''); 
            setphoto('');
            setId('');
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Hello {firstName}</Text>
              <TextInput value={firstName} placeholder="firstName" onChangeText={(e) => setFirstName(e)} />
              <TextInput value={lastName} placeholder="lastName" onChangeText={(e) => setLastName(e)} />
              <TextInput value={age} placeholder="age" onChangeText={(e) => setAge(e)} />
              <TouchableOpacity
                style={[styles.button, styles.buttonOpen]}
                onPress={() => cameraDenied('openCamara') }
              >
                <Text style={styles.textStyle}>Ambil Foto</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonOpen]}
                onPress={() => cameraDenied('openGallery') }
              >
                <Text style={styles.textStyle}>Ambil galery</Text>
              </TouchableOpacity>
              <Image source={{uri : photo}} style={{width: 100, height: 100}} />
              <TouchableOpacity
                style={[styles.button, styles.buttonOpen]}
                onPress={() => newPost()}
              >
                <Text style={styles.textStyle}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setModalDetail(!modalDetail)
                  setFirstName('');
                  setLastName('');
                  setAge(''); 
                  setphoto('');
                  setId('');
                }}
              >
                <Text style={styles.textStyle}>Hide Modal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      {
        userList.map((res, index) => {
          return (
            <View style={{backgroundColor: 'liaghtblue', color: "white", marginHorizontal: 10,}} key={index}>
              <View style={{}}>
                {/* <View style={{flexDirection: 'row'}}> */}
                  <Text>Name : {res.firstName} {res.lastName}</Text>
                  <Text>Age : {res.age}</Text>
                {/* </View> */}
                <Image source={{uri: res.photo !== 'N/A' ? res.photo : test}} style={{height: 115, width: 250, resizeMode: 'contain'}} />
                <View style={{flexDirection: 'row'}}>
                  
                  <TouchableOpacity
                    style={[styles.button, styles.buttonOpen]}
                    onPress={() => {
                      setModalDetail(true)
                      setFirstName(res.firstName);
                      setLastName(res.lastName);
                      setAge(`${res.age}`);
                      setphoto(`${res.photo}`);
                      setId(res.id);
                      }}
                  >
                    <Text>Edit / Details</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.buttonOpen]}
                    onPress={() => deleteContact(res.id)}
                  >
                    <Text>Delete</Text>
                </TouchableOpacity>
                </View>
              </View>
            </View>
          )
        })
      }
    </ScrollView>
    </View>
  )  
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default App;