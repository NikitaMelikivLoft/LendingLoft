const db = require("../model/db")

exports.getSkills = () => new Promise(async (resolve, reject) => {
  try {
    let result = db.get('skills').value();
    resolve(result)
  } catch (err) {
    reject(err)
  }
})

exports.updateSkills = ({ age, concerts, cities, years }) => new Promise(async (resolve, reject) => {
  try {
    let newSkills = {};
    if (age) {
      newSkills.age = {
        number: age,
        text: "Возраст начала занятий на скрипке"
      };
    } else reject("Не заполнено поле Возраст");
    if (concerts) {
      newSkills.concerts = {
        number: concerts,
        text: "Концертов отыграл"
      }
    } else reject("Не заполнено поле Концертов")
    if (cities) {
      newSkills.cities = {
        number: cities,
        text: "Максимальное число городов в туре"
      }
    } else reject("Не заполнено поле Число городов")
    if (years) {
      newSkills.years = {
        number: years,
        text: "Лет на сцене в качестве скрипача"
      }
    } else reject("Не заполнено поле Лет на сцене")

    db.get("skills").assign(newSkills).write()
    resolve(db.get("skills").value())
  } catch (err) {
    reject(err)
  }
})

exports.addProduct = (product) => new Promise(async (resolve, reject) => {
  try {
    console.log("addProduct");
    db.get('products')
      .push(product)
      .write()
    resolve(true)
  } catch {
    reject(err)
  }

})

exports.getProducts = () => new Promise(async (resolve, reject) => {
  try {
    let result = db.get('products').value();
    resolve(result)
  } catch (err) {
    reject(err)
  }
})