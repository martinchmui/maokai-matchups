import React from 'react';
import '../styles/header.css';
import { useNavigate } from 'react-router-dom';
import { DarkModeToggle } from '@anatoliygatt/dark-mode-toggle';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setMode } from '../redux/slices/darkModeSlice';

declare type Mode = 'dark' | 'light';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const mode: Mode = useAppSelector((state) => state.darkMode.mode);
  const handleModeToggle = () => {
    dispatch(setMode(mode === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className={`header-container container-padding ${mode}`}>
      <header className="header">
        <div className="title">
          <img
            src="/02SI009-full.png"
            height={45}
            width={45}
            alt="logo"
            id="logo"
            onClick={() => navigate('/')}
          />
          <span className="logo-text" onClick={() => navigate('/')}>
            Maokai Matchups{' '}
            <span className="author-text" onClick={(e) => e.stopPropagation()}>
              by{' '}
              <a
                href="https://linktr.ee/aizolol"
                target="_blank"
                rel="noreferrer"
                className="link"
              >
                Aizo
              </a>
            </span>
          </span>
        </div>
        <DarkModeToggle
          size="sm"
          dark="Dark"
          light="Light"
          mode={mode ?? 'light'}
          onChange={handleModeToggle}
        />
      </header>
    </div>
  );
};

export default Header;
