import React from 'react';
import {View, Text, StyleSheet, Button,Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';





const NewPage = () => {
    const navigation = useNavigation();
    // console.log(handleSelect(dataTable,1));
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#e4fab7', '#e4fab7']}
                start={{ x: 0.1, y: 0.15 }}
                style={styles.background}
            />
            <Text style={styles.title}>Grocery Statistics</Text>
            <View>
                <Text style={styles.text}>Money Spent</Text>
                <LineChart
                    data={{
                        labels: ["January", "February", "March", "April", "May", "June"],
                        datasets: [{
                            data: [
                                Math.random() * 100,
                                Math.random() * 100,
                                Math.random() * 100,
                                Math.random() * 100,
                                Math.random() * 100,
                                Math.random() * 100
                            ]
                        }]
                    }}
                    width={Dimensions.get("window").width}
                    height={220}
                    yAxisLabel="$"
                    yAxisSuffix=""
                    yAxisInterval={1}
                    chartConfig={{
                        backgroundColor: "#4db4ac",
                        backgroundGradientFrom: "#4db4ac",
                        backgroundGradientTo: "#4db4ac",
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: "#4db4ac"
                        }
                    }}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                />
            </View>

            <View>
                <Text style={styles.text}>Carbon Emissions</Text>
                <LineChart
                    data={{
                        labels: ["January", "February", "March", "April", "May", "June"],
                        datasets: [{
                            data: [
                                Math.random() * 100,
                                Math.random() * 100,
                                Math.random() * 100,
                                Math.random() * 100,
                                Math.random() * 100,
                                Math.random() * 100
                            ]
                        }]
                    }}
                    width={Dimensions.get("window").width}
                    height={220}
                    yAxisLabel=""
                    yAxisSuffix="KG"
                    yAxisInterval={1}
                    chartConfig={{
                        backgroundColor: "#4db4ac",
                        backgroundGradientFrom: "#4db4ac",
                        backgroundGradientTo: "#4db4ac",
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: "#4db2bf"
                        }
                    }}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                />
            </View>

            <Button title="Go to Shopping List" onPress={() => navigation.navigate('ShoppingList')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 25,
        margin: 10,
        color: "#695d46"
    },
    title: {
        fontSize: 38,
        fontWeight: 'bold',
        margin: 10,
        color: "#eb7f19"
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 1000,
    }
});

export default NewPage;