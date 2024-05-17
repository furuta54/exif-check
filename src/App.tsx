import React from 'react'
import './App.scss'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Dropzone from 'react-dropzone'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import EXIF from 'exif-js'
import Copyright from './Copyright'

type FileInfo = {
  name: string,
  image: any,
  exif: any
}

const App = () => {
  const [fileInfos, setFileInfos] = React.useState<FileInfo[]>([])
  const onDrop = (files: File[]) => {
    setFileInfos(prev => [])
    console.log(files)
    files.forEach(file => {
      const fileReader = new FileReader()
      fileReader.onload = e => {
        EXIF.getData(file as unknown as string, () => {
          let exif = EXIF.getAllTags(file as unknown as string)
          const info: FileInfo = {name: file.name, image: e.target?.result, exif: exif}
          setFileInfos(prev => [...prev, info])
        })
      }
      fileReader.readAsDataURL(file)
    })
  }

  return (
    <div className="App">
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>

          <Typography variant="h4" component="h1" sx={{ mb: 2}}>
            Exif Check
          </Typography>

          <Dropzone onDrop={onDrop}>
            {({getRootProps, getInputProps}) => (
              <section>
                <div {...getRootProps()} className="dropzone">
                  <input {...getInputProps()} />
                  <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
              </section>
            )}
          </Dropzone>

          {fileInfos.length > 0 && 
          <div className="results">
            <TableContainer component={Paper}>
              <Table aria-label="results">
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Exif</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fileInfos.map(row => (
                    <TableRow key={row.name}>
                      <TableCell>
                        <img className="results-image" src={row.image} alt={row.name} /><br />
                        {row.name}
                      </TableCell>
                      <TableCell>
                        {Object.keys(row.exif).map(key => (
                          <div key={key}>{key}: {JSON.stringify(row.exif[key])}</div>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          }

          <Copyright className="copyright" />

        </Box>
      </Container>
    </div>
  )
}

export default App
