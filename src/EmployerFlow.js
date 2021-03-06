import React, { useState } from "react";
import { customHttpProvider } from "./config";
import { Framework } from "@superfluid-finance/sdk-core";
import { Button, Form, FormGroup, FormControl, Spinner } from "react-bootstrap";
import "./createFlow.css";
import { ethers } from "ethers";

//where the Superfluid logic takes place
async function createFlow(recipient, flowRate, name) {
  const mmProvider = new ethers.providers.Web3Provider(window.ethereum);
  const sf = await Framework.create({
    networkName: "ropsten",
    provider: mmProvider
  });

  const signer = sf.createSigner({
    privateKey:
      "", // enter here your private key
    provider: mmProvider
  });

  const ETHx = "0x6fC99F5591b51583ba15A8C2572408257A1D2797";

  try {
    const createFlowOperation = sf.cfaV1.createFlow({
      sender: "0x5649ed47db74Ee9c6aab10bE7e61B3FcF85dcE73",
      receiver: recipient,
      flowRate: flowRate,
      superToken: ETHx
      // userData?: string
    });

    console.log("Creating your stream...");

    const result = await createFlowOperation.exec(signer);
    console.log(result);
    setEmployees([{"name": name}]);

    console.log(
      `Congrats - you've just created a money stream!
    View Your Stream At: https://app.superfluid.finance/dashboard/${recipient}
    Network: Ropsten
    Super Token: ETHx
    Sender: 0x5649ed47db74Ee9c6aab10bE7e61B3FcF85dcE73
    Receiver: ${recipient},
    FlowRate: ${flowRate}
    `
    );
  } catch (error) {
    console.log(
      "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
    );
    console.error(error);
  }
}

export const EmployerFlow = () => {
  const [recipient, setRecipient] = useState("");
  const [name, setName] = useState("");
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [flowRate, setFlowRate] = useState("");
  const [flowRateDisplay, setFlowRateDisplay] = useState("");
  const [employees, setEmployees] = useState([{"name": "test_employee"}]);

  function calculateFlowRate(amount) {
    if (typeof Number(amount) !== "number" || isNaN(Number(amount)) === true) {
      alert("You can only calculate a flowRate based on a number");
      return;
    } else if (typeof Number(amount) === "number") {
      if (Number(amount) === 0) {
        return 0;
      }
      const amountInWei = ethers.BigNumber.from(amount);
      const monthlyAmount = ethers.utils.formatEther(amountInWei.toString());
      const calculatedFlowRate = monthlyAmount * 3600 * 24 * 30;
      return calculatedFlowRate;
    }
  }

  function CreateButton({ isLoading, children, ...props }) {
    return (
      <Button variant="success" className="button"  style={{marginLeft: "30px"}} {...props}>
        {isButtonLoading ? <Spinner animation="border" /> : children}
      </Button>
    );
  }

  const handleRecipientChange = (e) => {
    setRecipient(() => ([e.target.name] = e.target.value));
  };

  const handleNameChange = (e) => {
    setName(() => ([e.target.name] = e.target.value));
  };

  const handleFlowRateChange = (e) => {
    setFlowRate(() => ([e.target.name] = e.target.value));
    // if (typeof Number(flowRate) === "number") {
    let newFlowRateDisplay = calculateFlowRate(e.target.value);
    setFlowRateDisplay(newFlowRateDisplay.toString());
    // setFlowRateDisplay(() => calculateFlowRate(e.target.value));
    // }
  };

  return (
    <div style={{margin: "50px"}}>
      <h1 >Employer Portal</h1>
      <Form>
        <h2 style={{marginTop: "50px"}}>Add New Employee</h2>
        <FormGroup className="mb-3">
          <FormControl
            name="name"
            value={name}
            onChange={handleNameChange}
            placeholder="Enter Employee's Name"
          ></FormControl>
        </FormGroup>        
        <FormGroup className="mb-3">
          <FormControl
            name="recipient"
            value={recipient}
            onChange={handleRecipientChange}
            placeholder="Enter Employee's Ethereum address"
          ></FormControl>
        </FormGroup>
        <FormGroup className="mb-3">
          <FormControl
            name="flowRate"
            value={flowRate}
            onChange={handleFlowRateChange}
            placeholder="Enter a flowRate in wei/second"
          ></FormControl>
        </FormGroup>
        <CreateButton
          onClick={() => {
            setIsButtonLoading(true);
            createFlow(recipient, flowRate, name, setEmployees);
            setTimeout(() => {
              setIsButtonLoading(false);
            }, 1000);
          }}
        >
          Add Employee to Payroll
        </CreateButton>
      </Form>
      

      

      <div className="description">
        {/* <p>
          Go to the CreateFlow.js component and look at the <b>createFlow() </b>
          function to see under the hood
        </p> */}
        <div className="calculation">
          <p>You will be paying this employee:</p>
          <p>
            <b>${flowRateDisplay !== " " ? flowRateDisplay : 0}</b> ETHx/month
          </p>
        </div>
      </div>

      <div style={{marginTop: "50px"}}>
        <h1>Your Employees</h1>

        {employees.map(employee => {
          return (
            <li>{employee.name}</li>

          )
        })}
      </div>
    </div>
  );
};
