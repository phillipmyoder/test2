/**
 * @name Project1
 * @author Phillip Yoder
 * @description gather information from https://jsonplaceholder.typicode.com/users
 *              and be able to manipulate or view all of the data
 * URL: https://project1-phillipyoder.herokuapp.com/
 */
/**
* References
*  https://www.w3schools.com/jsref/jsref_push.asp
*  "The Road to learn React" by robin wieruch
*  The Browser Team's part of the LTC-TMS project
*  and others, I forgot to write the names down as I went along 
*  I'll remember for next time
 * */
import React, { Component } from 'react'
import './App.css'

export default class App extends Component 
{
    constructor(props) 
    {
        super(props)
        this.state = {
            searchTerm: '',    // name to be searched
            allUsers: [],      // contains all current users
            newUser: { name: '', username: '', email: ''},
            results: [],       // for disaply to Table component
            error: ''          // contains error message for users
        }
    }
    /**
     * @name searching
     * @description sets input information to lower case and checks if there are any results
     */
    searching = (event) => 
    {
        // prevents the page from resetting
      event.preventDefault()

        let searchResults = this.state.allUsers.filter(users =>
            users.name.toLowerCase().includes(this.state.searchTerm.toLowerCase()))
        this.setState({ results: searchResults }) 

        if (searchResults.length <= 0)
        {
            this.setState({ error: '** THERE ARE NO MATCHING RESULTS **' })
        }
    }

    /**
     * @description sets the searchTerm to the word entered
     */
    setSearchTerm = (event) => this.setState({ searchTerm: event.target.value })

    /**
     * @name componentDidMount
     * @description grab the information from the website, store it, and give an error
     *               if something goes wrong
     */
    componentDidMount()
    {
      const info = 'https://jsonplaceholder.typicode.com/users'
      fetch(info)
        .then(infor => infor.json())
        .then(data => this.setState({ allUsers: data, results: data}))
        .catch(event => console.log('error', event))
    }
    /**
     * @name viewAllUsers
     * @description resets the table to be every user rather than the searched one
     */
    viewAllUsers = () => 
    {
        this.setState({ results: this.state.allUsers })
        this.setState({ searchTerm: '' }) 

    }
    /**
     * @name delete
     * @description is uesed to delete a user's information
     *               updates the table information to reflect when "viewAllUsers"
     *               is called
     */
    delete = (event, username) =>
    {
        this.setState({
          results: this.state.results.filter(users =>
              users.username !== username)
      })
      this.setState({
          allUsers: this.state.allUsers.filter(users =>
              users.username !== username)
      })
    }

    /**
     * @name add
     * @description adds the new user to the table 
     */
    add = (event) => 
    {
      // prevents the page from resetting
      event.preventDefault()

      let newName = true
      let newEmail = true
      const { allUsers, newUser } = this.state

      allUsers.some(user => {
          if (user.username === newUser.username) 
          {
              newName = false
              console.log({error: '**THIS USER NAME ALREADY EXISTS! TRY AGIAN!**'})
              return true
          } 
      })
      allUsers.some(user => {
        if (user.email === newUser.email) 
        {
            newEmail = false
            console.log({error: '**THIS EMAIL IS ALREADY BEING USED! TRY AGIAN!**'})
            return true
        } 
    })
      if (newName && newEmail) 
      {
          allUsers.push(this.state.newUser) 
          this.setState({ newUser: { name: '', username: '', email: '' } }) 
          document.getElementById('AddForm').reset() 
      }      

    }
    /**
     * @name addNewUser
     * @description adds the new user information to the newUser var
     */
    addNewUser = (event) => 
    {
        let newUser = this.state.newUser
        newUser[event.target.name] = event.target.value
        this.setState({ ...this.state, newUser: newUser }) 
    }

    render() {
        return (
            <div className="App">
                <div className = "App-header">
                <h2>Project 1 - Phillip Yoder&nbsp;
                    
                    <button id="button-inline" onClick={this.viewAllUsers}>View All Users</button> </h2>
                    </div>
                <Search onSubmit={this.searching} onChange={this.setSearchTerm} />
                <Table users={this.state.results} remove={this.delete} />
                <Add onSubmit={this.add} onChange={this.addNewUser} newUser = {this.state.newUser}/>

            </div>
        )
    }
}

/**
* @name Search
* @description activates the search function
*/
const Search = ({ onSubmit, onChange }) => 
(
    <form onSubmit={onSubmit}>
        <input onChange={onChange} required />
        <button id="searchButton">Search Name</button>
    </form>
)

/**
* @name Table
* @description sets up and fills in the table
*/
const Table = ({ users, remove }) => 
(
    // from className "table-header", is what spaces out the header of the table
    // from className "table-row", is what spaces out and fills in the actual contents of the table
    <div className="table">
        <div className="table-header">
        <span style = {{flex: 1, alignSelf: 'stretch'}}>Name</span>
        <span style = {{flex: 1, alignSelf: 'stretch'}}>Username</span>
        <span style = {{flex: 1, alignSelf: 'stretch'}}>Email</span>
        <span></span></div>
        {users.map((item) =>
            (
                <div className="table-row" key={item.username}>
                    <span style = {{flex: 1, alignSelf: 'stretch'}}>{item.name}</span>
                    <span style = {{flex: 1, alignSelf: 'stretch'}}>{item.username}</span>
                    <span style = {{flex: 1, alignSelf: 'stretch'}}>{item.email}</span>
                    
                    <span><button onClick={(event) => remove(event, item.username)}>Remove</button></span>
                </div>
            )
        )}
    </div>
)

/**
* @name Add
* @description makes the "add new user" part fit in with the style of the table
*               also makes sure that all the information needs to be entered to procede
*/
const Add = ({ onSubmit, onChange, newUser }) =>
(
    <form id="AddForm" className="table-row-add" onSubmit={onSubmit}>
        <input style = {{flex: 1, alignSelf: 'stretch'}} name="name"  placeholder="Enter Name" value={newUser.name} onChange={onChange} required />
        <input style = {{flex: 1, alignSelf: 'stretch'}} name="username" placeholder="Enter different Username" value={newUser.username} onChange={onChange} required />
        <input style = {{flex: 1, alignSelf: 'stretch'}} type="email" name="email" placeholder="Enter Email" value={newUser.email} onChange={onChange} required />
        <button>Add</button>
    </form>
)
