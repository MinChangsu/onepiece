import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

const ConfirmModal = (props) => {
  const { isShow, title, message, handleClose } = props;
  const [show, setShow] = useState(false);
  const handleAlertClose = () => handleClose(false);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 라이프사이클 시작
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // componentDidMount
  useEffect(() => {
    // console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ${props}`);
  }, []);

  // componentDidUpdate
  useEffect(() => {
    // console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ${props}`);
  });

  // componentWillReceiveProps
  useEffect(() => {
    setShow(isShow);
  }, [isShow]);
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 라이프사이클 끝
  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <Modal show={show} onHide={handleAlertClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant='primary' onClick={handleAlertClose}>
          확인
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
