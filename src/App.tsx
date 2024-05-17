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
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import EXIF from 'exif-js'
import Copyright from './Copyright'

type CameraInfo = {
  maker: string,
  model: string,
  width: string,
  height: string,
  focalLength: string,
  focalLength35mm: string,
  fNumber: string,
  exposureTime: string,
  iso: string,
}

type FileInfo = {
  name: string,
  image: any,
  exif: any,
  camera_info: CameraInfo
}

const convertExposureTime = (time: number): string => {
  if (time >= 1) {
    return time.toString()
  } else {
    return '1/' + (1 / time).toString()
  }
}

const App = () => {
  const [fileInfos, setFileInfos] = React.useState<FileInfo[]>([])
  const [onlyCameraInfo, setOnlyCameraInfo] = React.useState<boolean>(false)
  const onDrop = (files: File[]) => {
    setFileInfos(prev => [])
    console.log(files)
    files.forEach(file => {
      const fileReader = new FileReader()
      fileReader.onload = e => {
        EXIF.getData(file as unknown as string, () => {
          const exif = EXIF.getAllTags(file as unknown as string)
          console.log(exif)
          const camera_info = {
            maker: exif['Make'], 
            model: exif['Model'], 
            width: exif['PixelXDimension'], 
            height: exif['PixelYDimension'],
            focalLength: exif['FocalLength'],
            focalLength35mm: exif['FocalLengthIn35mmFilm'],
            fNumber: exif['FNumber'],
            exposureTime: exif['ExposureTime'],
            iso: exif['ISOSpeedRatings']
          }
          console.log(camera_info)
          const info: FileInfo = {name: file.name, image: e.target?.result, exif: exif, camera_info: camera_info}
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

          <div className="setting">
            <FormControlLabel label="Only camera information" control={<Checkbox checked={onlyCameraInfo} onChange={e => setOnlyCameraInfo(e.target.checked)} />} />
          </div>

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
                        {onlyCameraInfo ? 
                          <div>
                            メーカー: {row.camera_info.maker}<br />
                            モデル: {row.camera_info.model}<br />
                            幅: {row.camera_info.width} pixel<br />
                            高さ: {row.camera_info.height} pixel<br />
                            焦点距離: {JSON.stringify(row.camera_info.focalLength)} mm<br />
                            焦点距離(35mm換算): {row.camera_info.focalLength35mm} mm<br />
                            F値: {JSON.stringify(row.camera_info.fNumber)}<br />
                            シャッタースピード: {convertExposureTime(row.camera_info.exposureTime as unknown as number)} s<br />
                            ISO: {row.camera_info.iso}
                          </div> : 
                          Object.keys(row.exif).map(key => (
                            <div key={key}>{key}: {JSON.stringify(row.exif[key])}</div>
                          ))
                        }
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
