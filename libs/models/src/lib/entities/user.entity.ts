import { IUser } from '../business-types/users.interface';
import { AuthScope } from '../business-types/auth.scrop.enum';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from 'typeorm';
import { IsEmail } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { format } from 'date-fns';


@Entity("Users")
export class EUser implements IUser{

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({default: true})
  isActive!: boolean;

  @IsEmail()
  @Column({unique:true, nullable:false})
  email!: string;

  @Column({nullable:false})
  firstName!: string;

  @Column({nullable:false})
  lastName!: string;

  @Column({nullable:false})

  @Column({nullable:false})
  password!: string;

  @Column({type:"enum", enum: AuthScope,default: AuthScope.AMBASSADOR})
  authScope!: AuthScope;

  @VersionColumn()
  version!: number;

  // Utility Methods
  toggleUserStatus() {
    this.isActive = !this.isActive;
  }

  setAuthScope(authScope: AuthScope) {
    this.authScope = authScope;
  }

  getAuthScope(): AuthScope {
    return this.authScope;
  }

  @Exclude()
  @CreateDateColumn()
  createAt!:Date
  @Exclude()
  @UpdateDateColumn()
  updateAt!:Date

  @Expose() // Include formatted date
  get formattedCreateAt(): string {
    return format(new Date(this.createAt), 'yyyy-MM-dd HH:mm:ss');
  }

  /**
   * npm install date-fns
   * const formattedDate = format(new Date(this.updateAt), 'yyyy-MM-dd HH:mm:ss');
   * console.log(formattedDate); // Output: 2024-11-30 19:43:54
   *
   * */
  @Expose() // Include formatted date
  get formattedUpdateAt(): string {
    return format(new Date(this.updateAt), 'yyyy-MM-dd HH:mm:ss');
  }

  toJSON() {
    return {
      ...this,
      createAt: this.formattedCreateAt,
      updateAt: this.formattedUpdateAt,
    };
  }
}
