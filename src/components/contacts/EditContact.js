import React, { Component } from "react";
import { Consumer } from "../../context";
import TextInputGroup from "../layout/TextInputGroup";
import axios from "axios";

class AddContact extends Component {
  state = {
    name: "",
    email: "",
    phone: "",
    errors: {},
  };

  // Function when submit form
  onSubmit = async (dispatch, e) => {
    e.preventDefault();
    const { name, email, phone } = this.state;

    if (name === "") {
      this.setState({ errors: { name: "Name is required" } });
      return;
    }
    if (email === "") {
      this.setState({ errors: { email: "Email is required" } });
      return;
    }
    if (phone === "") {
      this.setState({ errors: { phone: "Phone is required" } });
      return;
    }

    const updateContact = {
      name,
      email,
      phone,
    };

    //Add data to array in Context
    const { id } = this.props.match.params;
    const response = await axios.put(
      `https://jsonplaceholder.typicode.com/users/${id}`,
      updateContact
    );
    dispatch({ type: "UPDATE_CONTACT", payload: response.data });

    //Clear state
    this.setState({
      name: "",
      email: "",
      phone: "",
      errors: {},
    });

    this.props.history.push("/");
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  async componentDidMount() {
    const { id } = this.props.match.params;
    const response = await axios.get(
      `https://jsonplaceholder.typicode.com/users/${id}`
    );
    const { name, email, phone } = response.data;

    this.setState({
      name,
      email,
      phone,
    });
  }

  render() {
    const { name, email, phone, errors } = this.state;

    return (
      <Consumer>
        {(value) => {
          const { dispatch } = value;
          return (
            <div className="card mb-3">
              <div className="card-header">Add Contact</div>
              <div className="card-body">
                <form onSubmit={this.onSubmit.bind(this, dispatch)}>
                  {/* Component Group Form  */}
                  <TextInputGroup
                    label="Name"
                    name="name"
                    placeholder="Enter Name..."
                    value={name}
                    onChange={this.onChange}
                    error={errors.name}
                  />

                  <TextInputGroup
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Enter Email..."
                    value={email}
                    onChange={this.onChange}
                    error={errors.email}
                  />

                  <TextInputGroup
                    label="Phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter Phone..."
                    value={phone}
                    onChange={this.onChange}
                    error={errors.phone}
                  />
                  {/* Component Group Form  */}
                  <input
                    type="submit"
                    value="Update Contact"
                    className="w-100 btn btn-light btn-lg btn-block"
                  />
                </form>
              </div>
            </div>
          );
        }}
      </Consumer>
    );
  }
}

export default AddContact;
