import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ImageBackground } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();

  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require('@/assets/images/background.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.innerContainer}
      >
        <Text style={styles.title}>Register</Text>

        <TextInput placeholder="Name" style={styles.input} />
        <TextInput placeholder="Email" style={styles.input} keyboardType="email-address" />
        <TextInput placeholder="Password" secureTextEntry style={styles.input} />
        <TextInput placeholder="Confirm Password" secureTextEntry style={styles.input} />


        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {
          navigation.navigate('Login');
        }}>
          <Text style={styles.loginText}>Already have an account?</Text>
        </TouchableOpacity>


      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
    width: '100%', 
    height: '100%',
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4CAF50',  
  },
  input: {
    width: '100%', 
    maxWidth: 280,
    padding: 12,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginText: {
    marginTop: 15,
    color: '#4CAF50',
    fontSize: 14,
  },
};
