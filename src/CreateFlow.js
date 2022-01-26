import React, { useState } from "react";
import { customHttpProvider } from "./config";
import { Framework } from "@superfluid-finance/sdk-core";
import { Button, Form, FormGroup, FormControl, Spinner } from "react-bootstrap";
import "./createFlow.css";
import { ethers } from "ethers";

//where the Superfluid logic takes place
async function createFlow(recipient, flowRate) {
  const sf = await Framework.create({
    networkName: "kovan",
    provider: customHttpProvider
  });

  const signer = sf.createSigner({
    privateKey:
      "0xd2ebfb1517ee73c4bd3d209530a7e1c25352542843077109ae77a2c0213375f1",
    provider: customHttpProvider
  });

  const DAIx = "0xe3cb950cb164a31c66e32c320a800d477019dcff";

  try {
    const createFlowOperation = sf.cfaV1.createFlow({
      sender: "0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721",
      receiver: recipient,
      flowRate: flowRate,
      superToken: DAIx
      // userData?: string
    });

    console.log("Creating your stream...");

    const result = await createFlowOperation.exec(signer);
    console.log(result);

    console.log(
      `Congrats - you've just created a money stream!
    View Your Stream At: https://app.superfluid.finance/dashboard/${recipient}
    Network: Kovan
    Super Token: DAIx
    Sender: 0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721
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

export const CreateFlow = () => {
  const [recipient, setRecipient] = useState("");
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [flowRate, setFlowRate] = useState("");
  const [flowRateDisplay, setFlowRateDisplay] = useState("");

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
      <Button variant="success" className="button" {...props}>
        {isButtonLoading ? <Spinner animation="border" /> : children}
      </Button>
    );
  }

  const handleRecipientChange = (e) => {
    setRecipient(() => ([e.target.name] = e.target.value));
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
    <div>
      <h2>Create a Flow</h2>
      <Form>
        <FormGroup className="mb-3">
          <FormControl
            name="recipient"
            value={recipient}
            onChange={handleRecipientChange}
            placeholder="Enter your Ethereum address"
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
            createFlow(recipient, flowRate);
            setTimeout(() => {
              setIsButtonLoading(false);
            }, 1000);
          }}
        >
          Click to Create Your Stream
        </CreateButton>
      </Form>

      <div className="description">
        <p>
          Go to the CreateFlow.js component and look at the <b>createFlow() </b>
          function to see under the hood
        </p>
        <div className="calculation">
          <p>Your flow will be equal to:</p>
          <p>
            <b>${flowRateDisplay !== " " ? flowRateDisplay : 0}</b> DAIx/month
          </p>
        </div>
      </div>
    </div>
  );
};
