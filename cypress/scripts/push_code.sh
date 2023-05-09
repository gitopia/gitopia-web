cd ..
rm -rf test-push-code
mkdir test-push-code
cd test-push-code
git init
export GITOPIA_WALLET=../gitopia-web/cypress/downloads/$walletName.json
git checkout -b test-branch-1
echo "This is file1." > file1.txt
echo "This is file2." > file2.txt
git add file1.txt file2.txt
git commit -m "Initial commit"
git checkout -b test-branch-2
echo "This is an additional line." >> file1.txt
git add file1.txt
git commit -m "Added a line to file1.txt"
git remote add gitopia gitopia://$walletName/$repoName
git push -u gitopia test-branch-1 test-branch-2
