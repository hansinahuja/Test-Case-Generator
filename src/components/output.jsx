import React, { Component } from "react";
import { Button } from "@material-ui/core";
import Title from "./title";

class Output extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    const el = this.textArea;
    el.select();
    document.execCommand("copy");
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <Title></Title>
        <div className="form-group">
          <textarea
            ref={(textarea) => (this.textArea = textarea)}
            className="form-control"
            id="output"
            rows="10"
            cols="5"
            style={{ backgroundColor: "rgba(0,0,0,0.5)", color: "white" }}
            value={this.props.output}
            color="white"
            readOnly
          ></textarea>
        </div>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          // href="#outlined-buttons"
        >
          Copy
        </Button>
      </form>
    );
  }
}

export default Output;
