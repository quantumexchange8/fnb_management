import Button from "@/Components/Button";
import { EditIcon } from "@/Components/Icon/Outline";
import TenantAuthenicatedLayout from "@/Layouts/TenantAuthenicatedLayout";
import { Spin } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Circle, Group, Image, Layer, Line, Rect, Stage, Text } from "react-konva";

export default function TableLayout({ floors }) {

    const { t, i18n } = useTranslation();

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
    const [selectedFloor, setSelectedFloor] = useState();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (floors && floors.length > 0) {
            setSelectedFloor(floors[0].id); // store ID only
        }
    }, [floors]);

    const fetchFloorPlan = async () => {
        setIsLoading(true);
        try {
            
            const response = await axios.get('/configuration/getFloorPlans', {
                params: { selectedFloor }
            })

            setShapes(response.data);

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

    const editFloorPlan = () => {
        window.location.href = `/configuration/edit-table-layout`
    }

    const selectFloor = (floorId) => {
        setSelectedFloor(floorId);
    };

    return (
        <TenantAuthenicatedLayout>
            <div className="flex flex-col gap-5 py-2 px-4">
                <div className="flex flex-col gap-1">
                    <div className="text-neutral-900 text-xxl font-bold">{t('table_setting')}</div>
                    <div className="text-neutral-500 text-sm font-medium">{t('last_updated_on')}</div>
                </div>
                <div className="flex flex-col border shadow-md rounded-md relative">
                    <div className="py-3 px-5 flex justify-between items-center border-b border-neutral-50">
                        <div className="text-neutral-900 text-lg font-bold">{t('floor_map')}</div>
                        <div className="text-neutral-300 text-xs italic">{t('set_up_your_pos_system_floor_map_here')}</div>
                    </div>
                    <div className="py-3 px-5 relative">
                        <div className="absolute z-30 top-5 left-5 flex items-center gap-3" >
                            {
                                floors && floors.length > 0 && (
                                    <div className="flex flex-row gap-3 max-w-[400px] overflow-x-auto">
                                        {
                                            floors.map((floor) => (
                                                <div key={floor.id} className={`${selectedFloor === floor.id ? 'bg-neutral-50 text-neutral-900' : 'bg-neutral-25 text-neutral-300'} flex items-center py-2 px-4 rounded-xl text-sm font-medium text-nowrap cursor-pointer`}
                                                    onClick={() => selectFloor(floor.id)}
                                                >
                                                    {floor.name}
                                                </div>
                                            ))
                                        }
                                    </div>
                                )
                            }
                        </div>

                        {
                            !isLoading && shapes ? (
                                <div className="flex max-h-[580px] w-full overflow-scroll">
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
                                                                    // onClick={(e) => handleSelect(shape, e)}
                                                                    // onTap={(e) => handleSelect(shape, e)}
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
                            ) : (
                                <div className="w-full h-[580px] flex justify-center items-center">
                                    <Spin size="large" />
                                </div>
                            )
                        }

                        <div className="absolute bottom-8 right-8">
                            <Button size="md" iconOnly pill={true} onClick={editFloorPlan}>
                                <EditIcon className='text-white w-5 h-5' />
                            </Button>
                        </div>

                    </div>
                </div>
            </div>
            
        </TenantAuthenicatedLayout>
    )
}