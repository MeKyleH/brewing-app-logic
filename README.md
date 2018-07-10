
# Brewing App Business Logic

This is the core business logic for a brewing app that I am building. It is built in Javascript using the ideas from [Uncle Bob's Clean Architecture](https://8thlight.com/blog/uncle-bob/2012/08/13/the-clean-architecture.html). You should be able to take this module and use any infrastructure you want to build out the GUI, DB, API etc. This is still a work in progress.

## Installation

`npm install git+ssh://git@github.com:severnsc/brewing-app-logic.git`

## Todo
- prevent editing of userId property for items
- add better tests for timer use cases

## Usage

The functions in the library are curryable and accept dependencies for things like the persistence layer. The recommended way to use this library is to have a compose file at the top level of your project structure where you inject all of your dependencies into the functions so you can then call them with only the scalar arguments in your application. For example, to use the `createUserUseCase` you need to provide a `createUser` function. This can be a mock for tests or in a production environment, it would be an adapter that connects the persistence layer to the use cases. For example:
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
## Structure
This architecture contains entities and use cases. Entities are abstractions of real world business objects. They are basic JSON data structures. Use cases are the application specific business rules that define how the entities behave within the application. They are Javascript functions that use injected dependencies to interact with the outer layers of the application.

## Entities
Entity function names are suffixed with `Entity` from the core. For example, the `inventory` entity function is exported from the core as `inventoryEntity`:
```javascript
const core = require('brewing-app-logic')

const inventory = core.inventoryEntity(...)
```
All of them have ids that are autogenerated by short-id on creation and are immutable. 
### Inventory
**Description:** An inventory is a named collection of `inventoryItems`. It has a user parent. 

**Arguments:**
- userId: String
- name: String

**Properties:**
- id: String
- userId: String
- name: String
- items: Array

**Usage:**

```javascript
const core = require('brewing-app-logic')

const newInventoryEntity = core.inventoryEntity("Hops Inventory", "1")
```

### Inventory Item
**Description:** An item that belongs to an inventory. It has a data blob (JSON object) that represents the real world entity that it is keeping track of. Contains information about quantities, costs and dates. It has a parent `inventory`.

**Arguments:**
- inventoryId: String
- object: Object 
- quantityUnit: String
- currentQuantity: Number
- reorderQuantity: Number
- reorderThreshold: Number
- costUnit: String
- unitCost: Number
- reorderCost: Number
- lastReorderDate: Date or null
- deliveryDate: Date or null
- createdAt: Date
- updatedAt: Date

**Properties:**
- id: String 
- inventoryId: String
- object: Object 
- quantityUnit: String (Unit of measurement for quantity amounts)
- currentQuantity: Number
- reorderQuantity: Number (The amount to order when a reorder is triggered)
- reorderThreshold: Number (The amount at which a reorder is triggered)
- costUnit: String (Unit of measurement for cost amounts)
- unitCost: Number
- reorderCost: Number
- lastReorderDate: Date or null
- deliveryDate: Date or null
- createdAt: Date
- updatedAt: Date

**Usage:**

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

### Timer
**Description:** A timer has a total duration and decrements at a constant rate. The timer is unit agnostic. It was designed this way to allow for different kinds of timer implementations (seconds, minutes, hours etc.)

**Arguments:**
- userId: String
- duration: Number
- intervalDuration: Number

**Properties:**
- id: String
- userId: String
- duration: Number
- remainingDuration: Number
- intervalDuration: Number
- isRunning: Boolean

**Usage:**

```javascript
const core = require('brewing-app-logic')

const newTimerEntity = core.timerEntity(
  "1",
  1000,
  500
)
```

### Timer Alert
**Description:** A timer alert has a parent timer, a message and an activation time. It is designed to deliver a message to the user at a given duration on the parent timer.

**Arguments:**
- timerId: String
- activationTime: Number
- message: String

**Properties:**
- id: String
- timerId: String
- activationTime: Number (when parent timer's `remainingDuration` is equal to `activationTime` the activation use case should trigger)
- message: String
- activated: Boolean

**Usage:**

```javascript
const core = require('brewing-app-logic')

const newTimerAlertEntity = core.timerAlertEntity(
  "1",
  1000,
  "Hello!"
)
```

### User
**Description:** A user is the main agent for managing ownership in the application. It is the abstraction of the real world end user. Timers and inventories belong to users (though the user entity has no knowledge of the timer and inventory entities).

**Arguments:**
- userName: String
- hashedPassword: String

**Properties:**
- id: String
- userName: String
- hashedPassword: String (use a cryptographically secure hashing function to generate this)

**Usage:**

```javascript
const core = require('brewing-app-logic')

const newUserEntity = core.userEntity(
  "user name",
  "hashed password"
)
```

## Use Cases
Use case function names are suffixed with `UseCase` from the core. For example, the `createInventory` use case is exported from the core as `createInventoryUseCase`:
```javascript
const core = require('brewing-app-logic')

const inventory = core.createInventoryUseCase(...)
```

All Use cases are asynchronous and return promises.

### Inventory Use Cases
---

#### Create Inventory
**Description:** Creates an inventory entity, passes it to `_createInventory` and returns the entity

**Arguments:**
- _createInventory: Function
- name: String
- userId: String

**Usage:**
```javascript
const core = require('brewing-app-logic')
const inventoryAdapter = require('inventory-adapter')

const inventoryPromise = core.createInventoryUseCase(inventoryAdapter.createInventory)("Hops Inventory", "1")
```

#### Get Inventory
**Description:** Passes the `inventoryId` to `findInventoryById` which returns a inventory entity. 

**Arguments:**
- findInventoryById: Function
- inventoryId: String

**Usage:**
```javascript
const core = require('brewing-app-logic')
const inventoryAdapter = require('inventory-adapter')

const inventoryPromise = core.getInventoryUseCase(inventoryAdapter.findInventoryById)("1")
```

#### Get Inventories By User Id
**Description:** Passes the `userId` to `userExists` which returns a boolean value. If `false` returns an empty array. If `true` returns an array of inventory entities.

**Arguments:**
- userExists: Function
- findInventoriesByUserId: Function
- userId: String

**Usage:**
```javascript
const core = require('brewing-app-logic')
const userAdapter = require('user-adapter')
const inventoryAdapter = require('inventory-adapter')

const inventoriesPromise = core.getInventoriesByUserIdUseCase(userAdapter.userExists)(inventoryAdapter.findInventoriesByUserId)("1")
```

#### Update Inventory
**Description:** Passes the `inventoryId` to `findInventoryById` which returns an inventory entity. Updates the entity by merging the updatePropsObj into a copy of the entity. Passes the updatedInventory to `saveInventory` and then returns it.

**Arguments:**
- findInventoryById: Function
- saveInventory: Function
- inventoryId: String
- updatePropsObj: Object

**Usage:**
```javascript
const core = require('brewing-app-logic')
const inventoryAdapter = require('inventory-adapter')

const updatedInventoryPromise = core.updateInventoryUseCase(inventoryAdapter.findInventoryById)(inventoryAdapter.saveInventory)("1", {name: "Malt Inventory"})
```

#### Delete Inventory
**Description:** Passes the `inventoryId` to `_deleteInventory`. Returns `null`. 

**Arguments:**
- _deleteInventory: Function
- inventoryId: String

**Usage:**
```javascript
const core = require('brewing-app-logic')
const inventoryAdapter = require('inventory-adapter')

const deletedInventoryPromise = core.deleteInventoryUseCase(inventoryAdapter.deleteInventory)("1")
```
### Inventory Item Use Cases
---
#### Create Inventory Item
**Description**: Passes the arguments to the entity function and creates an `inventoryItem` entity. Passes entity to `addToInventory` which should add to parent inventory's `inventoryItems` property. Then passes entity to `_createInventoryItem`. Returns the entity.

**Arguments:**
 - _createInventoryItem: Function
 - addToInventory: Function
 - inventoryId: String
 - object: Object
 - quantityUnit: String
 - currentQuantity: Number
 - reorderQuantity: Number
 - reorderThreshold: Number
 - costUnit: String
 - unitCost: Number
 - reorderCost: Number
 - lastReorderDate: Date or null
 - deliveryDate: Date or null
 - createdAt: Date
 - updatedAt: Date

**Usage:**
```javascript
const core = require('brewing-app-logic')
const inventoryItemAdapter = require('inventory-item-adapter')

const inventoryItemPromise = core.createInventoryItemUseCase(inventoryItemAdapter.createInventoryItem)("1", {name: "Some hops"}, "lbs", 100, 20, 10, "USD", 20, 200, null, null, new Date(), new Date())
```

#### Get Inventory Item
**Description:** Passes the `id` to `findInventoryItemById`which gets an inventory item entity and returns it.

**Arguments:**
- findInventoryItemById: Function
- id: String

**Usage:**
```javascript
const core = require('brewing-app-logic')
const inventoryItemAdapter = require('inventory-item-adapter')

const inventoryItemPromise = core.getInventoryItemUseCase(inventoryItemAdapter.findInventoryItemById)("1")
```
#### Get Inventory Items By Inventory Id
**Description:** Passes the `inventoryId` to `findInventoryItemsByInventoryId` which returns an array of `inventoryItems`. 

**Arguments:**
- findInventoryItemsByInventoryId: Function
- inventoryId: String

**Usage:**
```javascript
const core = require('brewing-app-logc')
const inventoryItemAdapter = require('inventory-item-adapter')

const inventoryItemPromise = core.getInventoryItemsByInventoryIdUseCase(inventoryItemAdapter.findInventoryItemsByInventoryId)("1")
```

### Update Inventory Item

**Description:** Passes the `id` to `findInventoryItemById`which returns an `inventoryItem` entity. Merges `updatePropsObject` into a copy of the `inventoryItem` entity. Passes the updated entity to `saveInventoryItem` and then returns the updated entity.

**Arguments:**
- findInventoryItemById: Function
- saveInventoryItem: Function
- id: String
- updatePropsObject: Object

**Usage:**
```javascript
const core = require('brewing-app-logc')
const inventoryItemAdapter = require('inventory-item-adapter') 

const updatedInventoryItemPromise = updateInventoryItemUseCase(inventoryItemAdapter.findInventoryItemById)(inventoryItemAdapter.saveInventoryItem)("1", {currentQuantity: 1})
```

#### Delete Inventory Item
**Description:** Passes the `id` to `_deleteInventoryItem`. Returns `null`.

**Arguments:**
- _deleteInventoryItem: Function
- id: String

**Usage:**
```javascript
const core = require('brewing-app-logc')
const inventoryItemAdapter = require('inventory-item-adapter') 

const deletedInventoryItemPromise = core.deleteInventoryItemUseCase(inventoryItemAdapter.deleteInventoryItem)("1")
```

### Timer Use Cases
---
#### Create Timer
**Description:** Creates a timer entity passing `userId, name, duration` and `intervalDuration`. Passes entity to `_createTimer`. Returns entity. 

**Arguments:**
- _createTimer: Function
- userId: String
- name: String
- duration: Number
- intervalDuration: Number

**Usage:**
```javascript
const core = rquire('brewing-app-logic')
const timerAdapter = require('timer-adapter')

const timerPromise = core.createTimerUseCase(timerAdapter.createTimer)("1", "timer", 1000, 500)
```

#### Get Timer
**Description:** Passes `timerId` to `findTimerById` which returns a timer entity. 

**Arguments:**
- findTimerById: Function
- timerId: String

**Usage:**
```javascript
const core = rquire('brewing-app-logic')
const timerAdapter = require('timer-adapter')

const timerPromise = core.getTimerUseCase(timerAdapter.findTimerById)("1")
```

#### Get Timers By User Id
**Description:** Passes `userId` to `userExists` which returns a boolean. If `false` returns an empty array. If `true` returns an array of timers whose `userId` property equals the `userId` argument.

**Arguments:**
- userExists: Function
- findTimersByUserId: Function
- userId: String

**Usage:**
```javascript
const core = rquire('brewing-app-logic')
const timerAdapter = require('timer-adapter')

const timerPromise = core.getTimersByUserIdUseCase(userAdapter.userExists)(timerAdapter.findTimersByUserId)("1")
```

#### Start Timer
**Description:** Passes the `timerId` to `findTimerById` which returns a timer entity. Creates a copy of the entity with the `isRunning` property set to `true`. Passes the `updatedTimer` to `saveTimer`. Returns the `updatedTimer`. 

**Arguments:**
- findTimerById: Function
- saveTimer: Function
- timerId: String

**Usage:**
```javascript
const core = rquire('brewing-app-logic')
const timerAdapter = require('timer-adapter')

const startedTimerPromise = core.startTimerUseCase(timerAdapter.findTimerById)(timerAdapter.saveTimer)("1")
```
#### Stop Timer
**Description:** Passes the `timerId` to `findTimerById` which returns a timer entity. Creates a copy of the entity with the `isRunning` property set to `false`. Passes the `updatedTimer` to `saveTimer`. Returns the `updatedTimer`.

**Arguments:**
- findTimerById: Function
- saveTimer: Function
- timerId: String

**Usage:**
```javascript
const core = rquire('brewing-app-logic')
const timerAdapter = require('timer-adapter')

const stoppedTimerPromise = core.stopTimerUseCase(timerAdapter.findTimerById)(timerAdapter.saveTimer)("1")
```

#### Decrement Timer
**Description:** Passes the `timerId` to `findTimerById` which returns a timer entity. Creates a copy of the entity with the `remainingDuration` property set to `remainingDuration - intervalDuration`. Passes the `updatedTimer` to `saveTimer`. Returns the `updatedTimer`.

**Arguments:**
- findTimerById: Function
- saveTimer: Function
- timerId: String

**Usage:**
```javascript
const core = rquire('brewing-app-logic')
const timerAdapter = require('timer-adapter')

const decrementedTimerPromise = core.decrementTimerUseCase(timerAdapter.findTimerById)(timerAdapter.saveTimer)("1")
```

#### Reset Timer
**Description:** Passes the `timerId` to `findTimerById` which returns a timer entity. Creates a copy of the entity with the `remainingDuration` property set to `duration`. Passes the `updatedTimer` to `saveTimer`. Returns the `updatedTimer`.

**Arguments:**
- findTimerById: Function
- saveTimer: Function
- timerId: String

**Usage:**
```javascript
const core = rquire('brewing-app-logic')
const timerAdapter = require('timer-adapter')

const resetTimerPromise = core.resetTimerUseCase(timerAdapter.findTimerById)(timerAdapter.saveTimer)("1")
```

#### Update Timer
**Description:** Passes the `timerId` to `findTimerById` and returns `timer`. Updates by merging `updatePropsObj` into the timer and passes `updatedTimer` to `saveTimer`. Returns the `updatedTimer`.

**Arguments:**
- findTimerById: Function
- saveTimer: Function
- id: String
- updatePropsObj: Object

**Usage:**
```javascript
const core = rquire('brewing-app-logic')
const timerAdapter = require('timer-adapter')

const updatedTimerPromise = core.updateTimerUseCase(timerAdapter.findTimerById)(timerAdapter.saveTimer)("1", {duration: 5000})
```

#### Delete Timer
**Description:** Passes the `timerId` to `_deleteTimer` and returns `null`.

**Arguments:**
- _deleteTimer: Function
- id: String

**Usage:**
```javascript
const core = rquire('brewing-app-logic')
const timerAdapter = require('timer-adapter')

const deletedTimerPromise = core.deleteTimerUseCase(timerAdapter.deleteTimer)("1")
```
### Timer Alert Use Cases
___

#### Create Timer Alert
**Description:** Creates a `timerAlert` entity passing the `timerId, activationTime` and `message` arguments to the entity function. Passes the entity to the `_createTimerAlert` function. Returns the entity.

**Arguments:**
- _createTimerAlert: Function
- timerId: String
- activationTime: Number
- message: String

**Usage:**
```javascript
const core = require('brewing-app-logic')
const timerAlertAdapter = require('timer-alert-adapter')

const timerAlertPromise = core.createTimerAlertUseCase(timerAlertAdapter.createTimerAlert)("1", 1000, "Hello")
```

#### Get Timer Alert
**Description:** Passes `timerAlertId` to `findTimerAlertById` which returns a `timerAlert` entity.

**Arguments:**
- findTimerAlertById: Function
- id: String

**Usage:**
```javascript
const core = require('brewing-app-logic')
const timerAlertAdapter = require('timer-alert-adapter')

const timerAlertPromise = core.createTimerAlertUseCase(timerAlertAdapter.findTimerAlertById)("1", 1000, "Hello")
```

#### Get Timer Alerts By Timer Id
**Description:** Passes `timerId` to `timerExists` which returns a boolean. If `false` returns an empty array. If true, passes `timerId` to `findTimerAlertsByTimerId` which returns an array of `timerAlert` entities.

**Arguments:**
- timerExists: Function
- findTimerAlertsByTimerId: Function
- timerId: String

**Usage:**
```javascript
const core = require('brewing-app-logic')
const timerAdapter = require('timer-adapter')
const timerAlertAdapter = require('timer-alert-adapter')

const timerAlertsPromise = core.getTimerAlertsByTimerIdUseCase(timerAdapter.timerExists)(timerAlertAdapter.findTimerAlertsByTimerId)("1")
```

#### Update Timer Alert
**Description:** Passes `timerAlertId` to `findTimerAlertById` which returns a `timerAlert` entity. Creates a copy of the entity merging in the `propUpdateObj`. Passes the updated entity to `saveTimerAlert`. Returns the updated entity.

**Arguments:**
- findTimerAlertById: Function
- saveTimerAlert: Function
- id: String
- updatePropsObj: Object

**Usage:**
```javascript
const core = require('brewing-app-logic')
const timerAlertAdapter = require('timer-alert-adapter')

const updatedTimerAlertPromise = core.updateTimerAlertUseCase(timerAlertAdapter.findTimerAlertById)(timerAlertAdapter.saveTimerAlert)("1", {message: "Bye!"})
```

#### Activate Timer Alert
**Description:** Passes `timerAlertId` to `findTimerAlertById` which returns a `timerAlert` entity. Creates a copy of the entity changing the `activated` prop to `true`. Calls `sendMessage` passing the `message` property from the `timerAlert`. Passes the activated timer alert to `saveTimerAlert` and returns it.

**Arguments:**
- findTimerAlertById: Function
- saveTimerAlert: Function
- sendMessage: Function
- timerAlertId: String

**Usage:**
```javascript
const core = require('brewing-app-logic')
const timerAlertAdapter = require('timer-alert-adapter')
const messageAdapter = require('message-adapter')

const activatedTimerAlertPromise = core.activateTimerAlertUseCase(timerAlertAdapter.findTimerAlertById)(timerAlertAdapter.saveTimerAlert)(messageAdapter.sendMessage)("1")
```

#### Delete Timer Alert
**Description:** Passes `timerAlertId` to `deleteFunc`. Returns `null`.

**Arguments:**
- _deleteTimerAlert: Function
- timerAlertId: String

**Usage:**
```javascript
const core = require('brewing-app-logic')
const timerAlertAdapter = require('timer-alert-adapter')

const deletedTimerAlertPromise = core.deleteTimerAlertUseCase(timerAlertAdatper.deleteTimerAlert)("1")
```

### User Use Cases
---
#### Create User
**Description:** Passes `userName` to `isUserNameUnique` which returns a boolean. If `false` throws an error. If `true`, passes the `email` to `isEmailUnique` which returns a boolean. If `false` throws and error. If `true`, passes the `password` to `hashPassword` and creates a user entity with the `userName` and `hashedPassword`. Passes the entity to `_createUser` and returns the entity.

**Arguments:**
- isUserNameUnique: Function
- isEmailUnique: Function
- _createUser: Function
- hashPassword: Function
- userName: String
- Password: String
- email: String

**Usage:**
```javascript
const core = require('brewing-app-logic')
const userAdapter = require('user-adapter')

const userPromise = core.createUserUseCase(userAdapter.isUserNameUnique)(userAdapter.isEmailUnique)(userAdapter.createUser)(userAdapter.hashPassword)("user name", "password", "me@example.com")
```
#### Get User
**Description:** Passes `userId` to `findUserById` which returns a user entity.

**Arguments:**
- findUserById: Function
- id: String

**Usage:**
```javascript
const core = require('brewing-app-logic')
const userAdapter = require('user-adapter')

const userPromise = core.getUserUseCase(userAdapter.findUserById)("1")
```

#### Update User
**Description:** Passes `userId` to `findUserById` which returns a user entity. Creates a copy of the entity with the `updatePropsObj` merged in. Checks that the updated user has unique userName and email with `isUserNameUnique` and `isEmailUnique`. Throws an error if either is false. If true, Passes the updated user entity to `saveUser` and then returns it.

**Arguments:**
- findUserById: Function
- isUserNameUnique: Function
- isEmailUnique: Function
- saveUser: Function
- id: String
- updatePropsObj: Object

**Usage:**
```javascript
const core = require('brewing-app-logic')
const userAdapter = require('user-adapter')

const updatedUserPromise = core.updateUserUseCase(userAdapter.findUserById)(userAdapter.isUserNameUnique)(userAdapter.isEmailUnique)(userAdapter.saveUser)("1", {userName: "New name!"})
```

#### Authenticate User
**Description:** Passes `userName` to `findUserByUsername` which returns a user entity. Passes `password` to `compareHash` which returns a boolean. If true, returns the user.

**Arguments:**
- findUserByUsername: Function
- compareHash: Function
- userName: String
- password: String

**Usage:**
```javascript
const core = require('brewing-app-logic')
const userAdapter = require('user-adapter')

const authenticatedUserPromise = core.authenticateUserUseCase(userAdapter.findUserByUsername)(userAdapter.compareHash)("1", "password")
```

#### Delete User
**Description:** Passes `userId` to `_deleteUser` and returns `null`.

**Arguments:**
- _deleteUser: Function
- id: String

**Usage:**
```javascript
const core = require('brewing-app-logic')
const userAdapter = require('user-adapter')

const deletedUserPromise = core.deleteUserUseCase(userAdapter.deleteUser)("1")
```
