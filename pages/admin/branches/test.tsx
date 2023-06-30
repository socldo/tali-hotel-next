// import React from 'react';
// import { Image } from 'primereact/image';

// export default function PreviewDemo() {
//     return (
//         <div className="card flex justify-content-center">
//             <Image src={`https://firebasestorage.googleapis.com/v0/b/tali-hotel.appspot.com/o/4f0055880daf57118211d71a7f797d6d.jpg?alt=media&token=7e884343-370d-4f76-839f-2f527b03d7aa`} zoomSrc={`https://firebasestorage.googleapis.com/v0/b/tali-hotel.appspot.com/o/4f0055880daf57118211d71a7f797d6d.jpg?alt=media&token=7e884343-370d-4f76-839f-2f527b03d7aa`} alt="Image" width="80" height="60" preview />
//             {/* <img src={`/Rebel_niner.png`} className="shadow-2" width="100" /> */}
//         </div>
//     )
// }

// import { useState } from 'react';
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// import { storage, analytics } from '../../../firebaseConfig';
// const ImageUploader = () => {
//     const [selectedImage, setSelectedImage] = useState<File | null>(null);
//     const [uploadProgress, setUploadProgress] = useState<number | null>(null);
//     const [downloadURL, setDownloadURL] = useState<string | null>(null);

//     const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
//         if (event.target.files && event.target.files.length > 0) {
//             setSelectedImage(event.target.files[0]);

//         }
//         console.log(selectedImage);
//     };

//     const handleImageUpload = async () => {
//         if (selectedImage) {



//             const storageRef = ref(storage, selectedImage.name);
//             const uploadTask = uploadBytesResumable(storageRef, selectedImage);

//             uploadTask.on('state_changed', (snapshot) => {
//                 const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//                 setUploadProgress(progress);
//             });

//             try {
//                 await uploadTask;

//                 const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//                 setDownloadURL(downloadURL);
//             } catch (error) {
//                 console.log('Error uploading image:', error);
//             }
//         }
//     };

//     return (
//         <div>

//             <input type="file" accept="image/*" onChange={handleImageSelect} />

//             <button onClick={handleImageUpload} disabled={!selectedImage}>
//                 Upload Image
//             </button>
//             {uploadProgress && <progress value={uploadProgress} max={100} />}
//             {downloadURL && (
//                 <div>
//                     <img src={downloadURL} alt="Uploaded Image" />
//                     <p>Image URL: {downloadURL}</p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ImageUploader;

import React, { useState } from 'react';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';

interface TemplateDemoProps {
    onSelectedFiles: (files: File[]) => void;
}


export default function AdvanceDemo(props: TemplateDemoProps) {

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);


    return (
        <div className="card">
            <FileUpload name="demo[]" url={'/api/upload'} multiple accept="image/*" maxFileSize={1000000} emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>} />
        </div>
    )
}