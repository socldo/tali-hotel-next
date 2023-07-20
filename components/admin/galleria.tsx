
import React, { useState, useEffect, useRef } from 'react';
import { Galleria } from 'primereact/galleria';
import { Button } from 'primereact/button';

interface Props {

    hotelImages: string[];
    listImageUpdate: (value: string[]) => void;
}

interface ImageObject {
    key: string;
    image: string;
}

const ShowAndUpdateImages: React.FC<Props> = ({
    hotelImages,
    listImageUpdate
}) => {

    const [images, setImages] = useState<ImageObject[]>([]);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const galleria = useRef<Galleria>(null);


    useEffect(() => {
        const imageObjects = hotelImages.map((image, index) => ({
            key: `image-${index}`,
            image: image
        }));
        setImages(imageObjects);
    }, [hotelImages]);

    useEffect(() => {

        const updatedImageStrings = images.map((imageObject: ImageObject) => imageObject.image);
        listImageUpdate(updatedImageStrings);

    }, [images]);

    const itemTemplate = (item: ImageObject) => {
        return (
            <div>
                <img src={item.image} alt={item.image} style={{ width: '100%', display: 'block' }} />
            </div>
        );
    };

    const handleDeleteImage = (item: ImageObject) => {
        const updatedImages = images.filter(image => image.key !== item.key);
        setImages(updatedImages);

    };

    const thumbnailTemplate = (item: ImageObject) => {
        return <img src={item.image} alt={item.key} style={{ display: 'block', width: '80px', height: '60px' }} />;
    }


    return (
        <div className="card-primereact flex justify-content-center" style={{ justifyContent: 'center'! }} >
            <Galleria
                ref={galleria}
                value={images}
                numVisible={5}
                style={{ maxWidth: '850px' }}
                activeIndex={activeIndex}
                onItemChange={(e) => setActiveIndex(e.index)}
                circular
                fullScreen
                showItemNavigators
                showThumbnails={true}
                item={itemTemplate}
                thumbnail={thumbnailTemplate}
            />
            <div className="grid" style={{
                maxWidth: '600px', display: 'flex',
                flexWrap: 'wrap',
                marginRight: '-0.5rem',
                marginLeft: '-0.5rem',
                marginTop: '-0.5rem'
            }}>

                <div className="grid" style={{ maxWidth: '600px', display: 'flex', flexWrap: 'wrap', marginRight: '-0.5rem', marginLeft: '-0.5rem', marginTop: '-0.5rem' }}>
                    {images &&
                        images.map((image, index) => {
                            let imgEl = (
                                <div style={{ display: "flex", marginTop: '1rem' }}>
                                    <div style={{ width: '120px', height: '90px' }}>
                                        <img
                                            src={image.image}
                                            alt={image.key}
                                            style={{ cursor: 'pointer', width: '100%', height: '100%', objectFit: 'cover' }}
                                            onClick={() => {
                                                setActiveIndex(index);
                                                galleria.current?.show();
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <Button icon="pi pi-times" style={{ marginLeft: '0.2rem' }} onClick={() => handleDeleteImage(image)} size="small" severity="danger" aria-label="Cancel" />
                                    </div>
                                </div>
                            );
                            return (
                                <div className="col-4" key={image.key} style={{ flex: '0 0 auto', padding: '0.5rem' }}>
                                    {imgEl}
                                </div>
                            );
                        })}
                </div>
            </div>

        </div >
    );
}
export default ShowAndUpdateImages;