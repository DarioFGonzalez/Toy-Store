import style from './DashboardSideBar.module.css';

interface SideBarProps
{
    setContent: (componentName: string) => void
}

const DashboardSideBar: React.FC<SideBarProps> = ( { setContent } ) =>
{
    return(
        <div className={style.sidebarContainer}>
            <button className={style.sidebarButton} onClick={() => setContent('products')}> Productos </button>
            <button className={style.sidebarButton} onClick={() => setContent('billboard')}> Cartelera </button>
            <button className={style.sidebarButton} onClick={() => setContent('media')}> Medias </button>
            <button className={style.sidebarButton} onClick={() => setContent('create')}> Nuevo ITEM </button>
        </div>
    );
};

export default DashboardSideBar;