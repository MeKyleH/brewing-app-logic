# Brewing App Business Logic

This is the core business logic for a brewing app that I am building. It is built in Javascript using the ideas from [Uncle Bob's Clean Architecture](https://8thlight.com/blog/uncle-bob/2012/08/13/the-clean-architecture.html). You should be able to take this module and use any infrastructure you want to build out the GUI, DB, API etc. This is still a work in progress.

## Todo
- Add logic to add inventoryItems to parent inventory on creation

## Installation

`npm intall git+ssh://git@github.com:severnsc/brewing-app-logic.git`

## Usage

The functions in thei library are curryable and accept dependencies for things like the persistence layer. The recommended way to use this library is to have a compose file at the top level of your project structure where you inject all of your dependencies into the functions so you can then call them with only the scalar arguments in your application. For example, to use the `createUserUseCase` you need to provide a `createUser` function. This can be a mock for tests or in a production environment, it would be an adapter that connects the persistence layer to the use cases. For example:
```javascript
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

const user = mongoose.model('User', {userName: String, password: String })

const createUser = (userEntity) => {
  const newUser = new User({userName: userEntity.userName, password: userEntity.password})
  newUser.save().then(() => console.log(newUser.userName))
}

module.exports = {
  createUser
}
```

You would then take this adapter function and inject it into the `createUserUseCase` (This doesn't reflect the real implementation, it's just an example of how to inject.):

```javascript
const core = require('brewing-app-logic')
const createUserAdapter = require('createUserAdapter')

const createUserUseCase = core.createUserUseCase(createUserAdapter.createUser)
```

This means that to swap out your DB code in this architecture, all you have to do is write a new adapter and inject it in the top compose file. Your usage throughout the rest of the application doesn't change.

---

This architecutre contains entities and use cases. Entities are abstractions of real world business objects. They are basic JSON data structures. Use cases are the application specific business rules that define how the entities behave within the application.

## Entities

### Inventory

An inventory is a named collection of items. It has the following properties:

```javascript
id: String (immutable and auto generated)
userId: String (reference to a user)
name: String (name of the inventory i.e. "Hops inventory")
items: Array (empty on creation, will be filled with items later)
```

To create an inventory call the `inventoryEntity` function from the core and give it a `name` and `userId`:

```javascript
const core = require('brewing-app-logic')

const newInventoryEntity = core.inventoryEntity("Hops Inventory", "1")
```

### Inventory Item

An item that belongs to an inventory. It has a data blob (JSON object) that is the real world entity that it is keeping track of. Contains information about quantities, costs and dates.

```javascript
id: String (immutable and auto generated)
inventoryId: String (reference to parent inventory)
object: Object (JSON object that represents real world item in inventory)
quantityUnit: String (Unit of measurement for the quantity measures)
currentQuantity: Number (amount of item in stock currently)
reorderQuantity: Number (The amount to order when a reorder is triggered)
reorderThreshold: Number (The amount at which a reorder is triggered)
costUnit: String (Unit of measurement for cost measures)
unitCost: Number (Amount that the item costs per unit of quantity)
reorderCost: Number (Total cost to reorder. Should equal unitCost * reorderQuantity in most cases)
lastReorderDate: Date or null (Last time a reorder was triggered)
deliveryDate: Date or null (Date of next delivery)
createdAt: Date (Date of creation)
updatedAt: Date (Date of update)
```

To create an inventoryItem call the `inventoryItemEntity` function from the core:

```javascript
const core = require('brewing-app-logic')

const newInventoryItemEntity = core.inventoryItemEntity(
  "1",
  {name: "Hop"},
  "lbs",
  10,
  5,
  1,
  "USD",
  20,
  100,
  null,
  null,
  new Date(),
  new Date()
)
```
