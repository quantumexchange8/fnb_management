import Button from "@/Components/Button";
import { CustomToaster } from "@/Components/CustomToaster";
import { ConfigIcon, DeleteIcon, DragIcon, EditIcon, MinusIcon, PlusIcon, RedoIcon, UndoIcon } from "@/Components/Icon/Outline";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import { router, useForm } from "@inertiajs/react";
import { Collapse, ColorPicker, Spin } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Circle, Group, Layer, Line, Rect, Stage, Text } from "react-konva";
import { ReactSortable } from "react-sortablejs";

export default function EditTableLayout({ floors }) {

    const { t, i18n } = useTranslation(); 
    const [selectedFloor, setSelectedFloor] = useState();
    const [manageSectionOpen, setIsManageSectionOpen] = useState(false);
    const [adding, setAdding] = useState(false);
    const [newInputName, setNewInputName] = useState("");
    const [isEditingIndex, setIsEditingIndex] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [floorPlans, setFloorPlans] = useState();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (floors && floors.length > 0) {
            setSelectedFloor(floors[0].id); // store ID only
        }
    }, [floors]);


    const stageRef = useRef();
    const GRID_SIZE = 20;
    const [canvasSize, setCanvasSize] = useState({ width: 1160, height: window.innerHeight * 0.85 });
    const [selectedId, setSelectedId] = useState('');
    const [selectedShape, setSelectedShape] = useState(null);
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [guides, setGuides] = useState([]);
    const [shapes, setShapes] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [mergeMode, setMergeMode] = useState(false);
    const [labelInput, setLabelInput] = useState('');
    const [paxInput, setPaxInput] = useState(2);
    const [colorInput, setColorInput] = useState('');
    const [availableColor, setAvailableColor] = useState("#FCFCFC");
    const [inUseColor, setIsUserColor] = useState("#FCFCFC");
    const [reservedColor, setReservedColor] = useState("#FCFCFC");
    const [removedTable, setRemovedTable] = useState([]);

    const fetchFloorPlan = async () => {
        setIsLoading(true);
        try {
            
            const response = await axios.get('/configuration/getFloorPlans', {
                params: { selectedFloor }
            })

            setShapes(response.data);

            if (response.data.length > 0) {
                // ✅ initialize colors from first table (or you could use a global setting in DB)
                setAvailableColor(response.data[0].color);
                setIsUserColor(response.data[0].secondary_color);
                setReservedColor(response.data[0].tertiary_color);
            }

        } catch (error) {
            console.error('error', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (selectedFloor) {
            fetchFloorPlan();
        }
    }, [selectedFloor]);

    const selectFloor = (floorId) => {
        setSelectedFloor(floorId);
    };

    

    const { data, setData, post, processing, errors, reset } = useForm({
        type: '',

        // section
        floors: floors ? floors.map(floor => ({
            id: floor.id.toString(),
            name: floor.name || '',
            order_no: floor.order_no,
        })) : [
            { id: '', name: '', order_no: ''}
        ],
        removedFloor: [],

    }); 

    const getNextTableId = (shapes) => {
        // Find the highest table_id in the shapes array
        let max = 0;
        shapes.forEach(shape => {
            if (shape.table_id && /^T\d+$/.test(shape.table_id)) {
            const num = parseInt(shape.table_id.substring(1), 10);
            if (num > max) max = num;
            }
        });
        const nextNum = max + 1;
        return 'T' + String(nextNum).padStart(2, '0');
    };
    
    const addShape = () => {
        const table_id = getNextTableId(shapes);

        const newShape = {
            table_id,
            type: 'square',
            x: 100,
            y: 100,
            width: 75,
            height: 75,
            label: table_id,
            color: availableColor,
            secondary_color: inUseColor,
            tertiary_color: reservedColor,
            pax: 2,
        };
        setShapes([...shapes, newShape]);
    };

    const addCircle = () => {
        const table_id = getNextTableId(shapes);

        const newShape = {
            table_id,
            type: 'circle',
            x: 300,
            y: 100,
            radius: 37.5,
            label:table_id,
            color: availableColor,
            secondary_color: inUseColor,
            tertiary_color: reservedColor,
            pax: 2,
        };
        setShapes([...shapes, newShape]);
    };

    const handleAvailableColorChange = (color) => {
        const hexColor = color.toHexString(); // antd ColorPicker returns a Color object
        setAvailableColor(hexColor);

        // ✅ update all shapes' primary color
        setShapes((prevShapes) =>
            prevShapes.map((shape) => ({
                ...shape,
                color: hexColor,
            }))
        );
    };
    const handleInUseColorChange = (color) => {
        const hexColor = color.toHexString(); // antd ColorPicker returns a Color object
        setIsUserColor(hexColor);

        // ✅ update all shapes' primary color
        setShapes((prevShapes) =>
            prevShapes.map((shape) => ({
                ...shape,
                secondary_color: hexColor,
            }))
        );
    };
    const handleReservedColorChange = (color) => {
        const hexColor = color.toHexString(); // antd ColorPicker returns a Color object
        setReservedColor(hexColor);

        // ✅ update all shapes' primary color
        setShapes((prevShapes) =>
            prevShapes.map((shape) => ({
                ...shape,
                tertiary_color: hexColor,
            }))
        );
    };


    const handleSelect = (tableId, e) => {
        
        if (mergeMode) {
            setSelectedIds(prev =>
                prev.includes(tableId.table_id)
                    ? prev.filter(id => id !== tableId.table_id)
                    : [...prev, tableId.table_id]
            );
        } else {
            setSelectedId(tableId.table_id);
            setSelectedShape(tableId.type);
            const shape = shapes.find(s => s.table_id === tableId.table_id);
            if (shape) {
                setLabelInput(shape.label);
                setPaxInput(shape.pax);
                setColorInput(shape.color);
            }
        }
    };

    const updatePax = (delta) => {
        setPaxInput((prev) => {
            const newPax = Math.max(1, prev + delta); // prevent below 1
            const minWidth = 75;
            const widthPerPax = 37.5;
            const minRadius = 37.5;
            const radiusPerPax = 18.75;

            const newShapes = shapes.map((shape) => {
            if (shape.table_id === selectedId) {
                if (shape.type === "circle") {
                const newRadius = minRadius + (newPax - 2) * radiusPerPax;
                return { ...shape, pax: newPax, radius: newRadius };
                } else {
                const newWidth = minWidth + (newPax - 2) * widthPerPax;
                return { ...shape, pax: newPax, width: newWidth };
                }
            }
            return shape;
            });

            setShapes(newShapes);
            return newPax;
        });
    };

    const rotateSelected = (angle) => {
        const newShapes = shapes.map(shape =>
            shape.table_id === selectedId
                ? { ...shape, rotation: ((shape.rotation || 0) + angle) % 360 }
                : shape
        );
        setShapes(newShapes);
    };

    const deleteShape = () => {
        if (!selectedId) return;

        const updatedShapes = shapes.filter(shape => shape.table_id !== selectedId);
        setShapes(updatedShapes);
        setSelectedId(''); // clear selection
        setSelectedShape(null);

        setRemovedTable([selectedId])
    };

    const saveShapes = async () => {
        const tableId = shapes.length > 0 ? shapes[0].table_id : null;

        try {
            
            const response = await axios.post('/configuration/store-table-layout', {
                shapes,
                floor: selectedFloor,
                table_id: tableId,
                removedTable: removedTable
            })

            setRemovedTable([])

        } catch (error) {
            console.error('error', error);
        }
    };


    const addBg = [
        {
            key: '1',
            label: <span className="text-neutral-900 text-base font-bold">Add Background</span>,
            children: <>
                <div className="px-4 flex flex-col gap-3">
                    <div className="flex flex-col">
                        <div className="text-neutral-400 text-xs font-medium">Background will be applied to all sections.</div>
                    </div>
                    <Button size="md" variant="white" className="flex justify-center items-center gap-2 w-full"><PlusIcon/><span>Upload Image</span></Button>
                </div>
                <div className="flex flex-col gap-2 py-5 px-4">
                    <div className="text-neutral-900 text-base font-bold">Table Status Colour</div>
                    <div className="flex flex-col lg:grid lg:grid-cols-3 items-center gap-3">
                        <ColorPicker value={availableColor} onChange={handleAvailableColorChange} >
                            <div className="w-full p-3 flex flex-col items-center gap-3 border border-neutral-50 bg-white rounded-xl" >
                                <div className="w-8 h-8 rounded-full border border-neutral-50" style={{ backgroundColor: availableColor }}></div>
                                <div className="text-neutral-500 text-xs font-medium">Available</div>
                            </div>
                        </ColorPicker>
                        <ColorPicker value={inUseColor} onChange={handleInUseColorChange} >
                            <div className="w-full p-3 flex flex-col items-center gap-3 border border-neutral-50 bg-white rounded-xl">
                                <div className="w-8 h-8 rounded-full border border-neutral-50" style={{ backgroundColor: inUseColor }}></div>
                                <div className="text-neutral-500 text-xs font-medium text-nowrap">In Use</div>
                            </div>
                        </ColorPicker>
                        <ColorPicker value={reservedColor} onChange={handleReservedColorChange} >
                            <div className="w-full p-3 flex flex-col items-center gap-3 border border-neutral-50 bg-white rounded-xl" >
                                <div className="w-8 h-8 rounded-full border border-neutral-50" style={{ backgroundColor: reservedColor }}></div>
                                <div className="text-neutral-500 text-xs font-medium">Reserved</div>
                            </div>
                        </ColorPicker>
                    </div>
                </div>
            </>,
        },
    ];

    const addTable = [
        {
            key: '1',
            label: <span className="text-neutral-900 text-base font-bold">Add Table</span>,
            children: <>
                <div className="flex flex-col gap-2 px-5 pb-5">
                    <div className="w-full flex flex-col lg:flex-row items-center gap-3">
                        <Button variant="textOnly" className={`w-full flex gap-3 p-2.5 rounded-xl border border-neutral-100 hover:bg-neutral-25 bg-white shadow-button box-border max-h-11`} onClick={addShape} >
                            <div className="w-5 h-5 border border-neutral-200 bg-neutral-50 rounded-sm"></div>
                            <div className="text-neutral-500 text-base font-medium wf">Square</div>
                        </Button>
                        <Button variant="textOnly" className={`w-full flex gap-3 p-2.5 rounded-xl border border-neutral-100 hover:bg-neutral-25 bg-white shadow-button box-border max-h-11`} onClick={addCircle} >
                            <div className="w-5 h-5 border border-neutral-200 bg-neutral-50 rounded-full"></div>
                            <div className="text-neutral-500 text-base font-medium wf">Round</div>
                        </Button>
                    </div>
                </div>
            </>,
        }
    ]

    const tableDetails = [
        {
            key: '1',
            label: <span className="text-neutral-900 text-base font-bold">Selected Table Detail</span>,
            children: <>
                <div className="flex flex-col gap-2 px-5 pb-5">
                    <div className="flex flex-col gap-4">
                        <div className="w-full flex flex-col lg:flex-row items-center gap-3">
                            <Button variant="textOnly" className={`${selectedShape === 'square' ? 'border-primary-500' : 'border-neutral-200' } w-full flex gap-3 p-2.5 rounded-xl border bg-white shadow-button box-border max-h-11 cursor-default`} >
                                <div className="w-5 h-5 border border-neutral-200 bg-neutral-50 rounded-sm"></div>
                                <div className="text-neutral-500 text-base font-medium wf">Square</div>
                            </Button>
                            <Button variant="textOnly" className={`${selectedShape === 'circle' ? 'border-primary-500' : 'border-neutral-200' } w-full flex gap-3 p-2.5 rounded-xl border border-neutral-100 hover:bg-neutral-25 bg-white shadow-button box-border max-h-11 cursor-default`} >
                                <div className="w-5 h-5 border border-neutral-200 bg-neutral-50 rounded-full"></div>
                                <div className="text-neutral-500 text-base font-medium wf">Round</div>
                            </Button>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="text-neutral-500 text-xs font-medium">Table Number</div>
                            <TextInput 
                                type="text"
                                value={labelInput}
                                onChange={(e) => {
                                    const newLabel = e.target.value;
                                    setLabelInput(newLabel);
                                    const newShapes = shapes.map(shape =>
                                        shape.table_id === selectedId ? { ...shape, label: newLabel } : shape
                                    );
                                    setShapes(newShapes);
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="text-neutral-500 text-xs font-medium">Max. Seats</div>
                            <div className="flex flex-col lg:grid grid-cols-6 gap-2">
                                <Button 
                                    variant="textOnly"
                                    className={`py-3 px-4 rounded-xl border border-neutral-100 hover:bg-neutral-25 bg-white shadow-button box-border flex justify-center h-11 w-full lg:w-11 `}
                                    onClick={() => updatePax(-1)}
                                    disabled={paxInput <= 1} 
                                >
                                    <MinusIcon className={`text-neutral-900 w-5`} />
                                </Button>
                                <div className="col-span-4">
                                    <TextInput 
                                        className="border border-neutral-100 rounded-xl bg-white shadow-input w-full text-center"
                                        readOnly
                                        value={paxInput}
                                        type="number"
                                        min={1}
                                        onChange={(e) => {
                                            const newPax = e.target.value;
                                            setPaxInput(newPax);
                                            const minWidth = 75;
                                            const widthPerPax = 37.5;
                                            const minRadius = 37.5;
                                            const radiusPerPax = 18.75;
                                            const newShapes = shapes.map(shape =>{
                                                if (shape.table_id === selectedId) {
                                                    if (shape.type === 'circle') {
                                                        const newRadius = minRadius + (newPax - 2) * radiusPerPax;
                                                        return { ...shape, pax: newPax, radius: newRadius };
                                                    } else {
                                                        const newWidth = minWidth + (newPax - 2) * widthPerPax;
                                                        return { ...shape, pax: newPax, width: newWidth };
                                                    }
                                                }
                                                return shape;
                                            });
                                            setShapes(newShapes);
                                        }}
                                    />
                                </div>
                                <Button 
                                    variant="textOnly"
                                    className={`py-3 px-4 rounded-xl border border-neutral-100 hover:bg-neutral-25 bg-white shadow-button box-border flex justify-center h-11 w-full lg:w-11 `}
                                    onClick={() => updatePax(1)}
                                >
                                    <PlusIcon className={`text-neutral-900 w-5`} />
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="text-neutral-500 text-xs font-medium">Rotation</div>
                            <div className="grid grid-cols-2 gap-3">
                                <Button variant="textOnly" className={` w-full flex justify-center p-2.5 rounded-xl border border-neutral-100 hover:bg-neutral-25 bg-white shadow-button box-border max-h-11 `} 
                                    onClick={() => rotateSelected(-90)}
                                >
                                    <UndoIcon />
                                </Button>
                                <Button variant="textOnly" className={` w-full flex justify-center p-2.5 rounded-xl border border-neutral-100 hover:bg-neutral-25 bg-white shadow-button box-border max-h-11 `}
                                    onClick={() => rotateSelected(90)}
                                >
                                    <RedoIcon />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-5">
                    <Button size="md" variant="red" className="w-full flex justify-center" onClick={deleteShape} >Delete Table</Button>
                </div>
            </>
        }
    ];

    const manageSection = () => {
        setIsManageSectionOpen(true)
    }
    const closeManageSection = () => {
        setIsManageSectionOpen(false)
    }
    const saveFloorSection = async () => {
        try {
            
            const response = await axios.post('/configuration/update-manage-section', {
                floors: data.floors,
                removedFloor: data.removedFloor
            });

            if (response.status === 200) {
                setIsManageSectionOpen(false);
                router.reload({ only: ['floors'] });
                toast.success(`${t('manage_section_updated.')}`, {
                    title: `${t('manage_section_updated.')}`,
                    duration: 3000,
                    variant: 'variant3',
                });
                
            }

        } catch (error) {
            console.error('error manage section', error)
        }
    }
    const handleSort = (floors) => {
        const newSection = floors.map((id, index) => {
            const item = data.floors.find(p => p.id === id);
            return {
                ...item,
                order_no: index + 1,
            };
        });
        setData('floors', newSection);
    };
    const handleRemove = (id) => {
        const newSection = data.floors
            .filter(item => item.id !== id)
            .map((item, idx) => ({ 
                ...item, 
                order_no: idx + 1 
            }));
        setData('floors', newSection);
        setData('removedFloor', [id]);
    }; 
    const handleEdit = (index) => {
        setIsEditingIndex(index);
        setEditValue(data.floors[index].name);
    }; 

    const handleAdd = () => {
        const newId = Date.now().toString();
        const newSection = { 
            id: newId, 
            name: newInputName, 
            order_no: data.floors.length + 1 
        };
        setData('floors', [...data.floors, newSection]);

        setNewInputName('');
        setAdding(false);
    };

    const handleDragMove = (e, index) => {
        const node = e.target;
        let { x, y } = node.position();

        // Snap to grid
        const SNAP_DISTANCE = 8;
        const gridX = Math.round(x / GRID_SIZE) * GRID_SIZE;
        const gridY = Math.round(y / GRID_SIZE) * GRID_SIZE;

        if (Math.abs(x - gridX) < SNAP_DISTANCE) x = gridX;
        if (Math.abs(y - gridY) < SNAP_DISTANCE) y = gridY;

        // Optionally, snap to other shapes' centers (advanced)
        shapes.forEach((shape, i) => {
            if (i !== index) {
                const shapeCenterX = shape.x + (shape.width || shape.radius || 0) / 2;
                const shapeCenterY = shape.y + (shape.height || shape.radius || 0) / 2;
                const movingCenterX = x + (shapes[index].width || shapes[index].radius || 0) / 2;
                const movingCenterY = y + (shapes[index].height || shapes[index].radius || 0) / 2;
                if (Math.abs(movingCenterX - shapeCenterX) < SNAP_DISTANCE) {
                    x += shapeCenterX - movingCenterX;
                }
                if (Math.abs(movingCenterY - shapeCenterY) < SNAP_DISTANCE) {
                    y += shapeCenterY - movingCenterY;
                }
            }
        });

        // Actually set the snapped position
        node.position({ x, y });

        // Update the shapes state with the new position
        setShapes(prevShapes =>
            prevShapes.map((shape, i) =>
                i === index ? { ...shape, x, y } : shape
            )
        );
    
        // Update guides as before
        updateGuides({ ...shapes[index], x, y });
    };

    const updateGuides = (movingShape) => {
        const newGuides = [];
        const SNAP_DISTANCE = 8;

        shapes.forEach(shape => {
            if (shape.table_id !== movingShape.table_id) {
                // Center X alignment
                const movingCenterX = movingShape.x + (movingShape.width || movingShape.radius || 0) / 2;
                const shapeCenterX = shape.x + (shape.width || shape.radius || 0) / 2;
                if (Math.abs(movingCenterX - shapeCenterX) < SNAP_DISTANCE) {
                    newGuides.push({ points: [shapeCenterX, 0, shapeCenterX, window.innerHeight], color: 'blue' });
                }
                // Center Y alignment
                const movingCenterY = movingShape.y + (movingShape.height || movingShape.radius || 0) / 2;
                const shapeCenterY = shape.y + (shape.height || shape.radius || 0) / 2;
                if (Math.abs(movingCenterY - shapeCenterY) < SNAP_DISTANCE) {
                    newGuides.push({ points: [0, shapeCenterY, window.innerWidth, shapeCenterY], color: 'blue' });
                }
            }
        });

        // Snap to grid
        const gridX = Math.round(movingShape.x / GRID_SIZE) * GRID_SIZE;
        const gridY = Math.round(movingShape.y / GRID_SIZE) * GRID_SIZE;
        if (Math.abs(movingShape.x - gridX) < SNAP_DISTANCE) {
            newGuides.push({ points: [gridX, 0, gridX, window.innerHeight], color: 'blue' });
        }
        if (Math.abs(movingShape.y - gridY) < SNAP_DISTANCE) {
            newGuides.push({ points: [0, gridY, window.innerWidth, gridY], color: 'blue' });
        }

        setGuides(newGuides);
    };

    const cancelExit = () => {
        window.location.href = `/configuration/table-layout`;
    }

    return (
        <div className="flex flex-col">
            <CustomToaster />
            <div className="py-5 px-4 flex items-center justify-between border border-b border-neutral-100 sticky top-0 bg-white z-50">
                <div className="flex flex-col">
                    <div className="text-neutral-900 text-lg font-bold">{t('floor_map_editor')}</div>
                    <div className="text-neutral-400 text-xs">{t('last_updated_on')}:</div>
                </div>
                <div className="flex items-center gap-3">
                    <Button size="md" variant="white" onClick={cancelExit} >Cancel & Exit</Button>
                    <Button size="md" onClick={saveShapes} >Save</Button>
                </div>
            </div>
            <div className="flex gap-3 w-full p-4 relative">
                <div className="absolute z-30 top-8 left-8 flex items-center gap-3" >
                    {
                        floors && floors.length > 0 && (
                            <div className="flex flex-row gap-3 max-w-[400px] overflow-x-auto">
                                {
                                    floors.map((floor) => (
                                        <div key={floor.id} className={`${selectedFloor === floor.id ? 'bg-neutral-50 text-neutral-900' : 'bg-neutral-25 text-neutral-300'} flex items-center py-2 px-4 rounded-xl text-sm font-medium text-nowrap`}
                                            onClick={() => selectFloor(floor.id)}
                                        >
                                            {floor.name}
                                        </div>
                                    ))
                                }
                            </div>
                        )
                    }
                    <Button size="sm" variant="white" className="flex items-center gap-2 h-9 box-border" onClick={manageSection}><ConfigIcon /><span>Manage Section</span></Button>
                </div>
                {
                    !isLoading  && shapes ? (
                        <>
                            {/* CANVAS */}
                            <div className="w-3/4 max-h-[85vh] overflow-auto">
                                <Stage
                                    ref={stageRef}
                                    width={canvasSize.width}
                                    height={canvasSize.height}
                                    onMouseDown={e => {
                                        // Deselect if clicked on empty space (the stage itself)
                                        if (e.target === e.target.getStage()) {
                                        setSelectedId('');
                                        }
                                    }}
                                >
                                    <Layer>
                                        {
                                            backgroundImage ? (
                                                <Image 
                                                    image={backgroundImage}
                                                    x={0}
                                                    y={0}                       
                                                    width={canvasSize.width}
                                                    height={canvasSize.height}
                                                    listening={false}
                                                    keepRatio={true}
                                                />
                                            ) : (
                                                <>
                                                    {
                                                        [...Array(Math.ceil(canvasSize.width / GRID_SIZE)).keys()].map(i => (
                                                            <Line
                                                                key={`v-${i}`}
                                                                points={[i * GRID_SIZE, 0, i * GRID_SIZE, window.innerHeight]}
                                                                stroke="#F0F0F3"
                                                                strokeWidth={0.34}
                                                            />
                                                        ))}
                                                        {[...Array(Math.ceil(canvasSize.height / GRID_SIZE)).keys()].map(i => (
                                                            <Line
                                                                key={`h-${i}`}
                                                                points={[0, i * GRID_SIZE, window.innerWidth, i * GRID_SIZE]}
                                                                stroke="#F0F0F3"
                                                                strokeWidth={0.34}
                                                            />
                                                        ))
                                                    }
                                                </>
                                            )
                                        }
                                        {/* Guides */}
                                        {
                                            guides.map((guide, i) => (
                                                <Line
                                                    key={`guide-${i}`}
                                                    points={guide.points}
                                                    stroke={guide.color}
                                                    strokeWidth={0.5}
                                                    dash={[4, 4]}
                                                />
                                            ))
                                        }
                                    </Layer>

                                    <Layer>
                                        {/* Shapes */}
                                        {
                                            shapes && shapes.length > 0 ? (
                                                <>
                                                    {
                                                        shapes.map((shape, index) => (
                                                            <Group
                                                                key={shape.table_id}
                                                                id={shape.table_id}
                                                                x={shape.x}
                                                                y={shape.y}
                                                                rotation={shape.rotation}
                                                                offsetX={shape.type === 'circle' ? 0 : shape.width / 2}
                                                                offsetY={shape.type === 'circle' ? 0 : shape.height / 2}
                                                                draggable={selectedId === shape.table_id}
                                                                onClick={(e) => handleSelect(shape, e)}
                                                                onTap={(e) => handleSelect(shape, e)}
                                                                onDragMove={(e) => handleDragMove(e, index)}
                                                                onDragEnd={() => setGuides([])}
                                                                onTransformEnd={(e) => handleTransformEnd(e, index)}
                                                            >
                                                                {
                                                                    shape.type === 'circle' ? (
                                                                        <Circle
                                                                            radius={shape.radius}
                                                                            fill={selectedIds.includes(shape.table_id) ? "#FFF" : shape.color}
                                                                            stroke={
                                                                                mergeMode ? (selectedIds.includes(shape.table_id) ? "#F26522" : "#E4E4E7")
                                                                                    : (selectedId === shape.table_id ? "#F26522" : "#E4E4E7")
                                                                            }                                                            
                                                                            strokeWidth={1}
                                                                        />
                                                                    ) : (
                                                                        <Rect
                                                                            width={shape.width}
                                                                            height={shape.height}
                                                                            fill={selectedIds.includes(shape.table_id) ? "#FFF" : shape.color}
                                                                            stroke={
                                                                                mergeMode? (selectedIds.includes(shape.table_id) ? "#F26522" : "#E4E4E7")
                                                                                    : (selectedId === shape.table_id ? "#F26522" : "#E4E4E7")
                                                                            }
                                                                            strokeWidth={1}
                                                                            cornerRadius={12}
                                                                        />
                                                                    )
                                                                }
                                                                <Text
                                                                    text={shape.label || ''}
                                                                    fontSize={14}
                                                                    fill="black"
                                                                    align="center"
                                                                    verticalAlign="middle"
                                                                    width={shape.type === 'circle' ? shape.radius * 2 : shape.width}
                                                                    height={shape.type === 'circle' ? shape.radius * 2 : shape.height}
                                                                    x={shape.type === 'circle' ? 0 : shape.width / 2}
                                                                    y={shape.type === 'circle' ? 0 : shape.height / 2}
                                                                    offsetX={shape.type === 'circle' ? shape.radius : shape.width / 2}
                                                                    offsetY={shape.type === 'circle' ? shape.radius : shape.height / 2}
                                                                    rotation={-(shape.rotation || 0)}
                                                                    listening={false}
                                                                />
                                                                <Text
                                                                    text={shape.pax || ''}
                                                                    fontSize={12}
                                                                    fill="gray"
                                                                    align="center"
                                                                    verticalAlign="middle"
                                                                    width={shape.type === 'circle' ? shape.radius * 2 : shape.width}
                                                                    height={shape.type === 'circle' ? shape.radius * 2 : shape.height+40}
                                                                    x={shape.type === 'circle' ? 0 : shape.width / 2}
                                                                    y={shape.type === 'circle' ? 20 : shape.height / 2}
                                                                    offsetX={shape.type === 'circle' ? shape.radius : shape.width / 2}
                                                                    offsetY={shape.type === 'circle' ? shape.radius : shape.height / 2}
                                                                    rotation={-(shape.rotation || 0)}
                                                                    listening={false}
                                                                />
                                                            </Group>
                                                        ))
                                                    }
                                                </>
                                            ) : null
                                        }
                                        
                                    </Layer>
                                </Stage>
                            </div>
                            {/*  END CANVAS */}
                        </>
                    ) : (
                        <div className="w-3/4 max-h-[85vh] flex justify-center items-center">
                            <Spin size="large" />
                        </div>
                    )
                }
                <div className="w-1/4 flex flex-col gap-3 ">
                
                    <div className="flex flex-col border border-neutral-50 bg-white shadow-sec-voucher rounded-lg">
                        <Collapse ghost items={addBg} className="custom-collapse" expandIconPosition='end' />
                    </div>

                    <div className="flex flex-col border border-neutral-50 bg-white shadow-sec-voucher rounded-lg">
                        <Collapse ghost items={addTable} className="custom-collapse" expandIconPosition='end' />
                    </div>

                    <div className="flex flex-col border border-neutral-50 bg-white shadow-sec-voucher rounded-lg">
                        <Collapse ghost items={tableDetails} className="custom-collapse" expandIconPosition='end' />
                    </div>
                </div>
            </div>

            <Modal
                show={manageSectionOpen} 
                onClose={closeManageSection} 
                title={t('manage_section ')}
                maxWidth='md'
                maxHeight='md'
                footer={
                    <div className="flex items-center justify-end gap-4 w-full p-4">
                        <Button variant="white" size="md" onClick={closeManageSection}>Cancel</Button>
                        <Button size="md" onClick={saveFloorSection} >Save Changes</Button>
                    </div>
                }
            >
                <div className="flex flex-col gap-4 p-5">
                    {
                        floors && (
                            <>
                                <ReactSortable
                                    list={data.floors}
                                    setList={(newList) => {
                                        // sort based on dragged list
                                        handleSort(newList.map(item => item.id));
                                    }}
                                    animation={200}
                                    handle=".drag-handle"
                                    className="flex flex-col gap-4"
                                >
                                    {
                                        data.floors.map((floor, index) => (
                                            <div key={floor.id} data-id={floor.id} className="flex items-center gap-5 p-4 bg-neutral-25 rounded-lg">
                                                <div className="drag-handle cursor-move">
                                                    <DragIcon />
                                                </div>
                                                <div className="flex flex-col w-full">
                                                    {
                                                        isEditingIndex === index ? (
                                                            <TextInput
                                                                className="w-full"
                                                                value={editValue}
                                                                onChange={(e) => setEditValue(e.target.value.replace(/^\s+/, ""))}
                                                            />
                                                        ) : (
                                                            <div className="text-base font-bold text-neutral-900">
                                                                {floor.name}
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {
                                                        isEditingIndex === index ? (
                                                            <>
                                                                <Button size="md" variant="white" onClick={() => {
                                                                    setIsEditingIndex(null);
                                                                    setEditValue("");
                                                                }}>
                                                                    Cancel
                                                                </Button>
                                                                <Button size="md"
                                                                    onClick={() => {
                                                                        const updated = [...data.floors];
                                                                        updated[index].name = editValue;
                                                                        setData("floors", updated);
                                                                        setIsEditingIndex(null);
                                                                        setEditValue("");
                                                                    }}
                                                                    disabled={!editValue.trim()}
                                                                >
                                                                    Save
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className={`${index === 0 ? 'cursor-not-allowed opacity-35' : 'cursor-pointer'} p-3 border border-neutral-200 shadow-input rounded-full w-11 h-11 flex items-center justify-center hover:bg-neutral-50`}
                                                                    onClick={() => {if (index === 0) return; handleRemove(floor.id)}}
                                                                >
                                                                    <DeleteIcon />
                                                                </div>
                                                                <div className="p-3 border border-neutral-200 shadow-input rounded-full w-11 h-11 flex items-center justify-center hover:bg-neutral-50 cursor-pointer"
                                                                    onClick={() => handleEdit(index)}
                                                                >
                                                                    <EditIcon />
                                                                </div>
                                                            </>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        ))
                                    }
                                </ReactSortable>
                            </>
                        )
                    }
                    <div className="w-full flex flex-col gap-4">
                        {
                            adding && (
                                <div className="flex items-center gap-5 p-4 bg-neutral-25 rounded-lg">
                                     <div>
                                        <DragIcon />
                                    </div>
                                    <TextInput 
                                        className="w-full"
                                        value={newInputName}
                                        onChange={(e) => setNewInputName(e.target.value.replace(/^\s+/, ""))}
                                    />
                                    <div className="flex items-center gap-3">
                                        <Button
                                            variant="white"
                                            size="md"
                                            onClick={() => {
                                                setNewInputName("");
                                                setAdding(false);
                                            }}
                                            className="h-11 box-border"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            size="md"
                                            onClick={handleAdd}
                                            className="h-11 w-[60px] box-border"
                                            disabled={!newInputName.trim()}
                                        >
                                            Add
                                        </Button>
                                    </div>
                                </div>
                            )
                        }
                        <Button
                            size="md"
                            variant="white"
                            className="w-full flex justify-center items-center gap-2"
                            onClick={() => setAdding(true)}
                            disabled={adding || isEditingIndex}
                        >
                            <PlusIcon />
                            <span>Add Section</span>
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}