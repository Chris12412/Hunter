import React from "react";
import ReactToPrint from "react-to-print";
// import PropTypes from "prop-types";

class ComponentToPrint extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checkbox: false,
      dropdownValue: "dog"
    };
  }

  changeDropdown(event) {
    this.setState({ dropdownValue: event.target.value });
  }

  render() {
    return (
      <div>
        <table>
          <thead>
            <th>column 1</th>
            <th>column 2</th>
            <th>column 3</th>
          </thead>
          <tbody>
            <tr>
              <td>data 1</td>
              <td>data 2</td>
              <td>data 3</td>
            </tr>
            <tr>
              <td>data 1</td>
              <td>data 2</td>
              <td>data 3</td>
            </tr>
            <tr>
              <td>data 1</td>
              <td>data 2</td>
              <td>
                <input
                  type="checkbox"
                  checked={this.state.checkbox}
                  onChange={() =>
                    this.setState({ checkbox: !this.state.check })
                  }
                />
              </td>
            </tr>
          </tbody>
        </table>

        <select value={this.state.dropdownValue} onChange={this.changeDropdown}>
          <option value="">--Please choose an option--</option>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="hamster">Hamster</option>
          <option value="parrot">Parrot</option>
          <option value="spider">Spider</option>
          <option value="goldfish">Goldfish</option>
        </select>
      </div>
    );
  }
}

class Example extends React.Component {
  render() {
    return (
      <div>
        <ReactToPrint
            trigger={() => <a href="#">Print this out!</a>}
            content={() => this.componentRef}
        />
        <ComponentToPrint ref={el => (this.componentRef = el)} />
      </div>
    );
  }
}

export default Example;
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            // <div>
            //     <img src={url} className='absolute right-0 bottom-0 bg-blue-500 hover:bg-blue-700 text-xl rounded' style={{zIndex:'100000'}}></img>
            //     <div className="rounded w-[320px] h-[535px] relative" style={{border: '1px solid gray'}}>
            //         <img src={FondoAcrilico} className="flex rounded h-full w-full" alt="sin imagen" />
            //     </div>
            // </div>
  





