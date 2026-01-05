import { useLocation } from 'react-router';

function HeaderPathName() {
  const location = useLocation();
  const pathSegments = location.pathname
    .split('/')
    .filter((segment) => segment); // Split and remove empty segments
  let displayTitle = '';

  if (pathSegments.length > 0) {
    const lastSegment = pathSegments[pathSegments.length - 1];

    switch (lastSegment) {
      case 'new':
        displayTitle = 'New Job';
        break;
      case 'edit':
        displayTitle = 'Edit Job';
        break;
      case 'profile':
        displayTitle = 'Profile';
        break;
      // Add more cases as needed
      default:
        // You might want to handle other cases or leave it empty
        displayTitle =
          lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
        break;
    }
  }

  return <h1>{displayTitle}</h1>;
}

export default HeaderPathName;
