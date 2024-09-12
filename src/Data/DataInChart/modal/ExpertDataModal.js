import * as React from "react";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Dataset from "../component/common/Data/Dataset";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ExpertDataModal({
  modalOpen,
  setModalOpen,
  setDataCategory,
}) {
  const handleClose = () => {
    setModalOpen(false);
  };
  return (
    <div>
      <Modal
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Dataset
            setModalOpen={setModalOpen}
            setDataCategory={setDataCategory}
          />
        </Box>
      </Modal>
    </div>
  );
}
