import classNames from 'classnames';

export const User = ({ user, selectUser, isActive }) => {
  return (
    <a
      data-cy="FilterUser"
      href="#/"
      onClick={selectUser}
      className={classNames({ 'is-active': isActive })}
    >
      {user.name}
    </a>
  );
};
