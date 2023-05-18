import React, { useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import './index.css'
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

const FormatByObject = () => {

    const [finalCurl, setFinalCurl] = useState(null);
    const [inputText, setInputText] = useState('');
    const [openCopySuccess, setOpenCopySuccess] = useState(false);
    const [openError, setOpenError] = useState(false);
    
    const handleFormat = () => {
        // const request = {
        //     "url": "/api/generic?apiUrl=https://someurl/someheader",
        //     "method": "POST",
        //     "headers": {
        //         "Content-Type": "application/json",
        //         "locale": "en",
        //         "module": "somemodule",
        //         "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMwMjMsImVtYWlsIjoidW1zNTAwMDEwMDAxQHVtc21haWwuY29tIiwicGhvbmVOdW1iZXIiOiI1MDAwMTAwMDEiLCJwaG9uZU51bWJlckNvdW50cnlDb2RlIjoiKzk2NiIsInJvbGVJZCI6NDQsImFzV2FzYWx0QnVzaW5lc3NNYW5hZ2VyIjpmYWxzZSwiaWF0IjoxNjg0NDA0NDYwLCJleHAiOjE2ODk1ODg0NjAsImlzcyI6Indhc2FsdCJ9.DQc6Ua8JmFc7wNEdB3MJ1GxPeWOSWYM0bRuLR69qYx4"
        //     },
        //     "body": "{\"status\":\"rejected\",\"id\":363}"
        // };

        let request = inputText
        const isFormatValid = isValidFormat(request)
        if (!isFormatValid) {
            setOpenError(true)
            return
        }
        request = JSON.parse(request)
        
        let curlCommand = `curl -X ${request?.method} \\\n`;
        if (request.headers && typeof request.headers === 'object') {
            Object.entries(request.headers).forEach(([key, value]) => {
              curlCommand += `     -H "${key}: ${value}" \\\n`;
            });
          }
        if (request?.body) {
            curlCommand += `     -d '${request?.body}' \\\n`;
        }
        curlCommand += `\\\n     "${request?.url}"`;
        setFinalCurl(curlCommand)
    }

    function isValidFormat(input) {
        try {
            if (!input) {
              return false;
            }
          const data = JSON.parse(input);
      
          if (
            typeof data.url === 'string' &&
            typeof data.method === 'string' &&
            typeof data.headers === 'object'
          ) {
            // Optional body check
            if (data.body && typeof data.body !== 'string') {
              return false;
            }
      
            return true;
          }
      
          return false;
        } catch (error) {
          return false;
        }
    }
      

    const handleClear = () => {
        setFinalCurl(null)
        setInputText('')
    }

    const handleCopy = async () => {
        await copyToClipboard(finalCurl);
    }

    async function copyToClipboard(text) {
        try {
          await navigator.clipboard.writeText(text);
          setOpenCopySuccess(true)
        } catch (error) {
          console.error('Error copying text to clipboard:', error);
        }
    }

    const handleInputChange = (e) => {
        setInputText(e.target.value)
    }


    const handleCloseError = () => {
        setOpenError(false)
    }

    const handleCloseCopyBar = () => {
        setOpenCopySuccess(false)
    }

    return (
        <div className='main'>
            <div className='container' >
                <div className='input-box' >
                    <TextField
                        id="outlined-textarea"
                        placeholder="Paste your object here..."
                        multiline
                        rows={10}
                        style={{
                            width: '100%'
                        }}
                        onChange={handleInputChange}
                        value={inputText}
                    />
                    <Button 
                        style={{
                            marginTop: '20px'
                        }} 
                        variant="contained"
                        onClick={handleFormat}
                    >
                        Convert
                    </Button>
                    <Button 
                        style={{
                            marginTop: '20px',
                            marginLeft: '10px'
                        }} 
                        variant="outlined"
                        onClick={handleClear}
                    >
                        Clear
                    </Button>
                </div>
                <div className='result-box'>
                    <div className='button-wrap'>
                        <Button 
                            variant="contained"
                            onClick={handleCopy}
                            disabled={!finalCurl}
                        >
                            Copy
                        </Button>
                    </div>
                    <div className='curl-wrapper'>
                        {finalCurl}
                    </div>
                </div>
            </div>
            <Snackbar open={openCopySuccess} autoHideDuration={3000} onClose={handleCloseCopyBar}>
                <Alert onClose={handleCloseCopyBar} severity="success" sx={{ width: '100%' }}>
                    Copied Successfully!
                </Alert>
            </Snackbar>
            <Snackbar open={openError} autoHideDuration={3000} onClose={handleCloseError}>
                <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                    Incorrect format
                </Alert>
            </Snackbar>
        </div>
    );
}

export default FormatByObject;


