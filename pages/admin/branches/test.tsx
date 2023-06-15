import React from 'react';
import { Image } from 'primereact/image';

export default function PreviewDemo() {
    return (
        <div className="card flex justify-content-center">
            <Image src={`https://firebasestorage.googleapis.com/v0/b/tali-hotel.appspot.com/o/4f0055880daf57118211d71a7f797d6d.jpg?alt=media&token=7e884343-370d-4f76-839f-2f527b03d7aa`} zoomSrc={`https://firebasestorage.googleapis.com/v0/b/tali-hotel.appspot.com/o/4f0055880daf57118211d71a7f797d6d.jpg?alt=media&token=7e884343-370d-4f76-839f-2f527b03d7aa`} alt="Image" width="80" height="60" preview />
            {/* <img src={`/Rebel_niner.png`} className="shadow-2" width="100" /> */}
        </div>
    )
}
// pages\admin\branches\test.tsx
// D:\LVTN\front-end\tali-hotel-next\pages\admin\branches\test.tsx
// public\Rebel_niner.png
// D:\LVTN\front-end\tali-hotel-next\public\Rebel_niner.png