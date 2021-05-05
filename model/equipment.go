/*
 * @Author: Liu Yuchen
 * @Date: 2021-05-05 00:49:09
 * @LastEditors: Liu Yuchen
 * @LastEditTime: 2021-05-05 05:37:45
 * @Description:
 * @FilePath: /reserve_master/model/equipment.go
 * @GitHub: https://github.com/liuyuchen777
 */
package model

import (
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Equipment struct {
	Name    string       `json:"name"`
	Appoint [3][7][8]int `json:"appoint"`
}

func NewEquipment(Name string) *Equipment {
	var myAppoint [3][7][8]int
	for i := 0; i < 3; i++ {
		for j := 0; j < 7; j++ {
			for k := 0; k < 8; k++ {
				myAppoint[i][j][k] = -1
			}
		}
	}
	return &Equipment{
		Name:    Name,
		Appoint: myAppoint,
	}
}

// update equipment appoint status
func UpdateAppoint(name string, appoint [3][7][8]int) {
	collectionEquipment := client.Database("equipment").Collection("equipment")

	filter := bson.D{{"name", name}}
	update := bson.D{
		{"$set", bson.D{
			{"appoint", appoint},
		}},
	}

	updateResult, err := collectionEquipment.UpdateOne(ctx, filter, update)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Matched %v documents and updated %v documents.\n", updateResult.MatchedCount, updateResult.ModifiedCount)
}

// get all
func AllEquipment() []Equipment {
	// a slice to store find result
	var result []Equipment
	findOptions := options.Find()
	collectionEquipment := client.Database("equipment").Collection("equipment")

	curr, err := collectionEquipment.Find(ctx, bson.D{{}}, findOptions)
	if err != nil {
		log.Fatal(err)
	}

	//decode and append result
	for curr.Next(ctx) {
		var item Equipment
		if err := curr.Decode(&item); err != nil {
			log.Fatal(err)
		}
		result = append(result, item)
	}

	curr.Close(ctx)
	// fmt.Printf("Found multiple documents (array of pointers): %#v\n", result)

	return result
}
