type Props = {
  searchParams: {
    error?: string;
  };
};
import "./authError.scss";
export default function AuthErrorPage({ searchParams }: Props) {
  return (
    <div className="autherror">
      <div className="box-error">
        <div className="header-error">Authentication error</div>
        <div>{searchParams.error}</div>
      </div>
    </div>
  );
}
