import React, { Component } from "react";
import Input from "./input";
import Toggle from "./toggle";
import Joi from "joi-browser";
import { Button } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

class WeightedTree extends Component {
  state = {
    inputs: {
      t: "",
      n: "",
      indexing: "",
      min: "",
      max: "",
      includeN: true,
      includeT: true,
    },
    error: "",
  };

  schema = {
    t: Joi.number().integer().min(1).required().label("Number of test cases"),
    n: Joi.number().integer().min(1).required().label("Number of nodes"),
    indexing: Joi.number().integer().required().label("Indexing from"),
    min: Joi.number().integer().required().label("Minimum weight"),
    max: Joi.number().integer().required().label("Maximum weight"),
    includeN: Joi.boolean(),
    includeT: Joi.boolean(),
  };

  generateTree = () => {
    let { n, includeN, indexing, min, max } = this.state.inputs;
    n = parseInt(n);
    indexing = parseInt(indexing);
    min = parseInt(min);
    max = parseInt(max);
    let outp = String(n) + "\n";
    if (!includeN) outp = "";
    if (n === 1) return outp + "\n";
    let prufer = Array.from({ length: n - 2 }, () =>
      Math.floor(Math.random() * n)
    );
    let degree = new Array(n).fill(0);
    for (let i = 0; i < prufer.length; i++) {
      degree[prufer[i]] += 1;
    }
    for (let i = 0; i < n - 2; i++) {
      for (let j = 0; j < n; j++) {
        if (degree[j] === 0) {
          degree[j] = -1;
          let weight = Math.floor(Math.random() * (max - min + 1) + min);
          outp +=
            String(j + indexing) +
            " " +
            String(prufer[i] + indexing) +
            " " +
            String(weight) +
            "\n";
          degree[prufer[i]] -= 1;
          break;
        }
      }
    }
    let f = 0;
    for (let i = 0; i < n; i++) {
      if (degree[i] === 0 && f === 0) {
        outp += String(i + indexing) + " ";
        f = 1;
      } else if (degree[i] === 0 && f === 1) {
        let weight = Math.floor(Math.random() * (max - min + 1) + min);
        outp += String(i + indexing) + " " + String(weight) + "\n";
      }
    }
    return outp;
  };

  generateOutput = () => {
    let { t, includeT } = this.state.inputs;
    t = parseInt(t);
    let outp = String(t) + "\n";
    if (!includeT) outp = "";
    for (let i = 0; i < t; i++) {
      outp += this.generateTree();
    }
    return outp;
  };

  validate = () => {
    const { error } = Joi.validate(this.state.inputs, this.schema);
    if (!error) {
      let max = parseInt(this.state.inputs.max);
      let min = parseInt(this.state.inputs.min);
      if (max < min) return "Maximum weight cannot be less than minimum weight";
      else return "";
    } else return error.details[0].message;
  };

  handleSubmit = (e) => {
    e.preventDefault();

    let error = this.validate();
    this.setState({ error });

    if (error) return;

    //execute logic
    const outp = this.generateOutput();
    this.props.displayOutput(outp);
  };

  handleChange = ({ currentTarget: input }) => {
    let inputs = { ...this.state.inputs };
    inputs[input.name] = input.value;
    this.setState({ inputs });
  };

  handleSwitch = ({ currentTarget: input }) => {
    let inputs = { ...this.state.inputs };
    inputs[input.name] = !inputs[input.name];
    this.setState({ inputs });
  };

  clear = () => {
    const inputs = this.state.inputs;
    inputs.t = "";
    inputs.n = "";
    inputs.indexing = "";
    inputs.min = "";
    inputs.max = "";
    inputs.includeN = true;
    inputs.includeT = true;
    const error = "";
    this.setState({ inputs, error });
  };

  render() {
    const { t, n, indexing, includeN, includeT, max, min } = this.state.inputs;
    const { error } = this.state;
    const { handleChange, handleSubmit, handleSwitch } = this;
    const { switchedOn } = this.props;
    if (
      !switchedOn &&
      (t !== "" ||
        indexing !== "" ||
        n !== "" ||
        error !== "" ||
        max !== "" ||
        min !== "")
    ) {
      this.clear();
    }

    return (
      <form onSubmit={handleSubmit} autocomplete="off">
        <div className="row">
          <div className="col">
            <Input
              name="t"
              label={"T Test Cases"}
              value={t}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <Input
              name="n"
              label={"N Nodes"}
              value={n}
              onChange={handleChange}
            />
          </div>
          <div className="col">
            <Input
              name="indexing"
              label={"Indexing from"}
              value={indexing}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row" style={{ marginBottom: "20px" }}>
          <div className="col">
            <Input
              name="min"
              label={"Min Weight"}
              value={min}
              onChange={handleChange}
            />
          </div>
          <div className="col">
            <Input
              name="max"
              label={"Max Weight"}
              value={max}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <Toggle
              checked={includeN}
              label="Include N"
              onChange={handleSwitch}
              name="includeN"
            />
          </div>
          <div className="col">
            <Toggle
              checked={includeT}
              label="Include T"
              onChange={handleSwitch}
              name="includeT"
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          // href="#outlined-buttons"
        >
          Generate
        </Button>
        {error && <Alert severity="error">{error}</Alert>}
      </form>
    );
  }
}

export default WeightedTree;
