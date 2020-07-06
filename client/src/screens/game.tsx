import {createRef, FC} from 'react';
import React from 'react';
import {AssetManager} from '../game/hexLibraries/assetManager';
import {useEffectAsync} from '../hooks/useEffectAsync';
import {ClientGameManager} from '../game/clientGameManager';

export const Game: FC = () => {
  const gameCanvas = createRef<HTMLCanvasElement>();
  const menuCanvas = createRef<HTMLCanvasElement>();
  const overlayDiv = createRef<HTMLDivElement>();

  useEffectAsync(async () => {
    if (gameCanvas.current && menuCanvas.current && overlayDiv.current) {
      const size = {width: 80, height: 80};
      const base = {x: 40, y: 55};
      AssetManager.addAsset('Infantry', 'images/tower_10.png', size, base);
      AssetManager.addAsset('Tank', 'images/tower_40.png', size, base);
      AssetManager.addAsset('Base', 'images/tower_42.png', size, base);

      AssetManager.addAsset('tile', 'images/tile.png', size, base);

      AssetManager.addAssetFrame('Heli.TopLeft', 0, 'images/heli/top_left_1.png');
      AssetManager.addAssetFrame('Heli.TopLeft', 1, 'images/heli/top_left_2.png');

      AssetManager.addAssetFrame('Heli.TopRight', 0, 'images/heli/top_right_1.png');
      AssetManager.addAssetFrame('Heli.TopRight', 1, 'images/heli/top_right_2.png');

      AssetManager.addAssetFrame('Heli.BottomLeft', 0, 'images/heli/bottom_left_1.png');
      AssetManager.addAssetFrame('Heli.BottomLeft', 1, 'images/heli/bottom_left_2.png');

      AssetManager.addAssetFrame('Heli.BottomRight', 0, 'images/heli/bottom_right_1.png');
      AssetManager.addAssetFrame('Heli.BottomRight', 1, 'images/heli/bottom_right_2.png');

      AssetManager.addAssetFrame('Heli.Bottom', 0, 'images/heli/down_1.png');
      AssetManager.addAssetFrame('Heli.Bottom', 1, 'images/heli/down_2.png');

      AssetManager.addAssetFrame('Heli.Top', 0, 'images/heli/up_1.png');
      AssetManager.addAssetFrame('Heli.Top', 1, 'images/heli/up_2.png');

      await AssetManager.start();
      new ClientGameManager(gameCanvas.current, menuCanvas.current, overlayDiv.current);
    }
  }, [gameCanvas.current, menuCanvas.current, overlayDiv.current]);

  return (
    <>
      <canvas ref={gameCanvas} style={{position: 'absolute', left: 0, top: 0, width: '100vw', height: '100vh'}} />
      <canvas ref={menuCanvas} style={{position: 'absolute', left: 0, top: 0, width: '100vw', height: '100vh'}} />
      <div ref={overlayDiv} style={{position: 'absolute', left: 0, top: 0, width: '100vw', height: '100vh'}} />
    </>
  );
};
