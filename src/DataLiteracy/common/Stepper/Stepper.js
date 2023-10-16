import "./Stepper.scss";

function Stepper({ steps, activeStep }) {
  const stepClassName = currStep => {
    if (activeStep > currStep) return "mdl-stepper-step active-step step-done";
    if (activeStep === currStep)
      return "mdl-stepper-step active-step editable-step";
    return "mdl-stepper-step";
  };

  return (
    <div className="mdl-card mdl-shadow--2dp">
      <div className="mdl-card__supporting-text">
        <div className="mdl-stepper-horizontal-alternative">
          {steps.map((step, idx) => (
            <div key={step} className={stepClassName(idx + 1)}>
              <div className="mdl-stepper-circle">
                <span>{idx + 1}</span>
              </div>
              <div className="mdl-stepper-title">{step}</div>
              <div className="mdl-stepper-bar-left"></div>
              <div className="mdl-stepper-bar-right"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Stepper;
